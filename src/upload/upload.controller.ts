import * as path from 'node:path'
import { BadRequestException, Controller, Get, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from 'auth/auth.guard'
import { CurrentUser } from 'decorators/current-user.decorator'
import { QuoteRecordService } from 'quote-record/quote-record.service'
import { User } from 'user/user.entity'
import { UploadService } from './upload.service'

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly quoteRecordService: QuoteRecordService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('url')
  async getPresignedUrl(
    @Query('filename') filename: string,
    @Query('type') contentType: string,
  ) {
    const url = await this.uploadService.getPresignedUrl(filename, contentType)
    return { url }
  }

  @UseGuards(AuthGuard)
  @Post('quotes')
  @UseInterceptors(FileInterceptor('file'))
  async uploadQuotes(
    @CurrentUser() currentUser: User,
    @UploadedFile() file: Express.Multer.File
  ) {
    // File validation: Check if it's a markdown file
    const fileExtension = path.extname(file.originalname)
    if (fileExtension !== '.md') {
      throw new BadRequestException('File must be a markdown (.md) file')
    }

    // File validation: Check if it exceeds 10MB
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('File size exceeds the 10MB limit')
    }

    // Process the file contents
    const quotes = await this.uploadService.parseMarkdownFile(file.buffer.toString())

    // Save each quote as a QuoteRecord
    const res = await this.quoteRecordService.upsertMany(currentUser, quotes)
    if (res.length === 0) {
      return { message: `All these quotes already exist in the database!` }
    }
    return { message: `${res.length} quotes inserted successfully!` }
  }
}
