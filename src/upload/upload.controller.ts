import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'auth/auth.guard'
import { CurrentUser } from 'decorators/current-user.decorator'
import { QuoteService } from 'quote/quote.service'
import { User } from 'user/user.entity'
import { UploadService } from './upload.service'

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly quoteService: QuoteService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('url')
  async getPresignedUrl(
    @CurrentUser() currentUser: User,
    @Query('filename') filename: string,
    @Query('type') contentType: string,
  ) {
    const url = await this.uploadService.getPresignedUrl(currentUser, filename, contentType)
    return { url }
  }
}
