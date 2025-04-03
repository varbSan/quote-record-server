import { EntityManager, FilterQuery } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { QuoteRecord } from './quoteRecord.entity'

@Injectable()
export class QuoteRecordService {
  constructor(private readonly em: EntityManager) {}

  async getCount(filter: FilterQuery<QuoteRecord> = {}): Promise<number | null> {
    return this.em.count(
      QuoteRecord,
      filter,
    )
  }

  async findBy(filter: FilterQuery<QuoteRecord> = {}): Promise<QuoteRecord | null> {
    return this.em.findOne(
      QuoteRecord,
      filter,
    )
  }

  async getLast(): Promise<QuoteRecord | null> {
    const [quoteRecord] = await this.em.find(
      QuoteRecord,
      {},
      { orderBy: { createdAt: 'DESC' }, limit: 1 },
    )

    return quoteRecord
  }

  async getRandom(): Promise<QuoteRecord | null> {
    // TODO: find a more native way than the index
    const quoteRecords = await this.em.find(
      QuoteRecord,
      {}, // TODO: implement userId filter
    )
    const randomRecordIndex = Math.floor(Math.random() * (quoteRecords.length + 1)) 
    return quoteRecords[randomRecordIndex] // Return the first result from the array
  }

  async create(text: string): Promise<QuoteRecord> {
    const quoteRecord = this.em.create(QuoteRecord, { text, createdAt: new Date(), updatedAt: new Date() })
    await this.em.persistAndFlush(quoteRecord)
    return quoteRecord
  }

  async upsertMany(texts: string[]) {
    const textQuotes: { text: string }[] = texts.map(text => ({
      text,
    }))
    const upsertedQuoteRecords = await this.em.upsertMany(QuoteRecord, textQuotes)
    await this.em.persistAndFlush(upsertedQuoteRecords)
    return await this.em.find(QuoteRecord, { text: texts }) // refetch necessary to avoid printing duplicates
  }
}
