import { EntityManager, FilterQuery, FindOptions } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { AiService } from 'ai/ai.service'
import { User } from 'user/user.entity'
import { CreateQuote, DeleteQuote, Quote, UpdateQuote } from './quote.entity'

@Injectable()
export class QuoteService {
  constructor(
    private readonly em: EntityManager,
    private readonly aiService: AiService
  ) {}

  async getCount(filter: FilterQuery<Quote> = {}): Promise<number | null> {
    return this.em.count(
      Quote,
      filter,
    )
  }

  async findOneBy(filter: FilterQuery<Quote> = {}): Promise<Quote | null> {
    return this.em.findOne(
      Quote,
      filter,
    )
  }

  async findBy(filter: FilterQuery<Quote> = {}, options: FindOptions<Quote> = {}): Promise<Quote[] | null> {
    return this.em.find(
      Quote,
      filter,
      options
    )
  }

  async findByTerm(user: User, searchTerm?: string, limit = 50): Promise<Quote[] | null> {
    return this.findBy({
      user,
      ...(searchTerm ? { text: { $ilike: `%${searchTerm}%` } } : {}),
    }, {
      limit,
      orderBy: { updatedAt: -1 },
    })
  }

  async getLast(user: User): Promise<Quote | null> {
    const [quote] = await this.em.find(
      Quote,
      { user },
      { orderBy: { createdAt: 'DESC' }, limit: 1 },
    )

    return quote
  }

  async getRandom(filter: FilterQuery<Quote>): Promise<Quote | null> {
    // TODO: find a more native way than the index
    const quotes = await this.em.find(
      Quote,
      filter,
    )
    const randomRecordIndex = Math.floor(Math.random() * (quotes.length))
    return quotes[randomRecordIndex]
  }

  async create(createQuote: CreateQuote): Promise<Quote> {
    const quote = new Quote(createQuote)
    await this.em.persistAndFlush(quote)
    return quote
  }

  async generateImage(user: User, quoteId: number): Promise<Quote> {
    const quote = await this.findOneBy({
      id: quoteId,
      user,
    })
    if (!quote) {
      throw new Error('❗ quote not found ❗')
    }

    quote.imagePrompt = await this.aiService.createQuoteImagePrompt(quote.text)
    quote.imageUrl = await this.aiService.createQuoteImage({
      user,
      quoteId: quote.id,
      contentType: 'image/png',
      prompt: quote.imagePrompt,
    })

    await this.em.persistAndFlush(quote)
    return quote
  }

  async update(updateQuote: UpdateQuote): Promise<Quote> {
    const quote = await this.em.findOneOrFail(Quote, { id: updateQuote.id, user: updateQuote.user })
    quote.text = updateQuote.text
    quote.isPublic = updateQuote.isPublic
    await this.em.persistAndFlush(quote)
    return quote
  }

  async delete(deleteQuote: DeleteQuote): Promise<number> {
    return this.em.nativeDelete(Quote, { id: deleteQuote.id, user: deleteQuote.user })
  }

  async upsertMany(user: User, texts: string[], isPublic = false) {
    // remove duplicates
    const uniqueTexts = Array.from(new Set(texts))

    const existingQuotes = await this.findBy({ user, text: uniqueTexts })

    // extract existing texts for comparison
    const existingTexts = new Set(existingQuotes?.map(q => q.text))

    // filter out already existing texts
    const newQuotes = uniqueTexts
      .filter(text => !existingTexts.has(text)) // Only create new records
      .map(text => new Quote({ user, text, isPublic }))

    if (newQuotes.length > 0) {
      await this.em.persistAndFlush(newQuotes) // Use persistAndFlush to track entities
    }

    return newQuotes // Refetch to ensure consistency
  }
}
