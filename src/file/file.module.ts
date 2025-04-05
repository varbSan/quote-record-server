import { Module } from '@nestjs/common'
import { QuoteRecordModule } from 'quote-record/quote-record.module'
import { QuoteRecordService } from 'quote-record/quote-record.service'
import { UserService } from 'user/user.service'
import { FileController } from './file.controller'
import { FileService } from './file.service'

@Module({
  controllers: [FileController],
  imports: [QuoteRecordModule],
  providers: [QuoteRecordService, FileService, UserService],
})
export class FileModule {}
