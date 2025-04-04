import { Module } from '@nestjs/common'
import { QuoteRecordModule } from 'quoteRecord/quoteRecord.module'
import { QuoteRecordService } from 'quoteRecord/quoteRecord.service'
import { UserService } from 'user/user.service'
import { FileController } from './file.controller'
import { FileService } from './file.service'

@Module({
  controllers: [FileController],
  imports: [QuoteRecordModule],
  providers: [QuoteRecordService, FileService, UserService],
})
export class FileModule {}
