import { EntityManager, FilterQuery } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { User } from 'user/user.entity'
import { CreateQuoteRecord, QuoteRecord } from './quote-record.entity'

@Injectable()
export class QuoteRecordService {
  constructor(private readonly em: EntityManager) {}

  async getCount(filter: FilterQuery<QuoteRecord> = {}): Promise<number | null> {
    return this.em.count(
      QuoteRecord,
      filter,
    )
  }

  async findOneBy(filter: FilterQuery<QuoteRecord> = {}): Promise<QuoteRecord | null> {
    return this.em.findOne(
      QuoteRecord,
      filter,
    )
  }

  async findBy(filter: FilterQuery<QuoteRecord> = {}): Promise<QuoteRecord[] | null> {
    return this.em.find(
      QuoteRecord,
      filter,
    )
  }

  async getLast(user: User): Promise<QuoteRecord | null> {
    const [quoteRecord] = await this.em.find(
      QuoteRecord,
      { user },
      { orderBy: { createdAt: 'DESC' }, limit: 1 },
    )

    return quoteRecord
  }

  async getRandom(user: User): Promise<QuoteRecord | null> {
    // TODO: find a more native way than the index
    const quoteRecords = await this.em.find(
      QuoteRecord,
      { user },
    )
    const randomRecordIndex = Math.floor(Math.random() * (quoteRecords.length))
    return quoteRecords[randomRecordIndex]
  }

  async create(createQuoteRecord: CreateQuoteRecord): Promise<QuoteRecord> {
    const quoteRecord = new QuoteRecord(createQuoteRecord)
    await this.em.persistAndFlush(quoteRecord)
    return quoteRecord
  }

  async upsertMany(user: User, texts: string[]) {
    // remove duplicates
    const uniqueTexts = Array.from(new Set(texts))

    const existingQuotes = await this.findBy({ user, text: uniqueTexts })

    // extract existing texts for comparison
    const existingTexts = new Set(existingQuotes?.map(q => q.text))

    // filter out already existing texts
    const newQuoteRecords = uniqueTexts
      .filter(text => !existingTexts.has(text)) // Only create new records
      .map(text => new QuoteRecord({ user, text }))

    if (newQuoteRecords.length > 0) {
      await this.em.persistAndFlush(newQuoteRecords) // Use persistAndFlush to track entities
    }

    return newQuoteRecords // Refetch to ensure consistency
  }
}
