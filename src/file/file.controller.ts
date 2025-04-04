import * as path from 'node:path'
import { BadRequestException, Controller, ForbiddenException, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { QuoteRecordService } from 'quoteRecord/quoteRecord.service'
import { UserService } from 'user/user.service'
import { FileService } from './file.service'

@Controller('file')
export class FileController {
  constructor(
    private readonly fileServie: FileService,
    private readonly quoteRecordService: QuoteRecordService,
    private readonly userService: UserService
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
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

    // TODO: get currentUser in decorator
    const currentUser = await this.userService.findOneBy({ id: 1 })
    if (!currentUser)
      throw new ForbiddenException(`User of id ${1} does not exist`)
    // Save each quote as a QuoteRecord
    const res = await this.quoteRecordService.upsertMany(currentUser, quotes)
    if (res.length === 0) {
      return { message: `All quotes already existed in the database!` }
    }
    return { message: `${res.length} quotes inserted successfully!` }
  }
}
