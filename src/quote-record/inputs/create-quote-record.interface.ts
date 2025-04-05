import type { QuoteRecord } from 'quote-record/quote-record.entity'

// TODO: merge .input.ts and .interface.ts. at the moment impossible because of grapqhl-ws mikro-orm cli error
export interface CreateQuoteRecord {
  text: QuoteRecord['text']
  author: QuoteRecord['author']
}
