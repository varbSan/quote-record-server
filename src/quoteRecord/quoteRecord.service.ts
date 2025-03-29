import { EntityManager } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { QuoteRecord } from './quoteRecord.entity'

@Injectable()
export class QuoteRecordService {
  constructor(private readonly em: EntityManager) {}

  async getLast(): Promise<QuoteRecord | null> {
    const [quoteRecord] = await this.em.find(
      QuoteRecord,
      {},
      { orderBy: { createdAt: 'DESC' }, limit: 1 },
    )

    return quoteRecord
  }

  async create(text: string): Promise<QuoteRecord> {
    const quoteRecord = this.em.create(QuoteRecord, { text })
    await this.em.persistAndFlush(quoteRecord)
    return quoteRecord
  }
}
