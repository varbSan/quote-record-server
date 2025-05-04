import { UseGuards } from '@nestjs/common'
import {
  Args,
  Mutation,
  Resolver,
} from '@nestjs/graphql'
import { AuthGuard } from 'auth/auth.guard'
import { CurrentUser } from 'decorators/current-user.decorator'
import { QuoteService } from 'quote/quote.service'
import { User } from 'user/user.entity'
import { UploadService } from './upload.service'

@Resolver(() => String)
export class UploadResolver {
  constructor(
    private readonly uploadService: UploadService,
    private readonly quoteService: QuoteService
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async uploadQuotes(
    @CurrentUser() currentUser: User,
    @Args('fileName') fileName: string
  ) {
    const fileContent = await this.uploadService.getFileContent(currentUser, fileName)
    if (!fileContent)
      throw new Error('❗ Fetching file from bucket failed ❗')

    // Process the file contents
    const quotes = await this.uploadService.parseMarkdownFile(fileContent)

    // Save each quote as a Quote
    const res = await this.quoteService.upsertMany(currentUser, quotes)
    if (res.length === 0) {
      return 'All these quotes already exist in the database!'
    }
    return `${res.length} quotes inserted successfully!`
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async generatePresignedUrlFileUpload(
    @CurrentUser() currentUser: User,
    @Args('fileName') fileName: string,
    @Args('contentType') contentType: string,
  ) {
    return this.uploadService.generatePresignedUrlUpload(`user-${currentUser.id}_filename-${encodeURIComponent(fileName)}_0`, contentType)
  }
}
