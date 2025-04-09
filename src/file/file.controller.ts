import * as path from 'node:path'
import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from 'auth/auth.guard'
import { CurrentUser } from 'decorators/current-user.decorator'
import { QuoteRecordService } from 'quote-record/quote-record.service'
import { User } from 'user/user.entity'
import { FileService } from './file.service'

@Controller('file')
export class FileController {
  constructor(
    private readonly fileServie: FileService,
    private readonly quoteRecordService: QuoteRecordService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
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
    const quotes = await this.fileServie.parseMarkdownFile(file.buffer.toString())

    // Save each quote as a QuoteRecord
    const res = await this.quoteRecordService.upsertMany(currentUser, quotes)
    if (res.length === 0) {
      return { message: `All these quotes already exist in the database!` }
    }
    return { message: `${res.length} quotes inserted successfully!` }
  }
}
