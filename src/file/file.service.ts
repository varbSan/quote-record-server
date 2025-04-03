import { Injectable } from '@nestjs/common'

@Injectable()
export class FileService {
  constructor() {}

  // Helper method to parse the markdown content
  parseMarkdownFile(content: string): string[] {
    // Split the content by double line breaks (\n{2,}), which signifies a new quote
    const quotes = content.split(/\n{2,}/).map(quote => quote.trim())

    // Filter out empty quotes if any exist
    return quotes.filter(quote => quote.length > 0)
  }
}
