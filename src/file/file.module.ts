import { Module } from '@nestjs/common'
import { AuthService } from 'auth/auth.service'
import { QuoteRecordModule } from 'quote-record/quote-record.module'
import { QuoteRecordService } from 'quote-record/quote-record.service'
import { UserService } from 'user/user.service'
import { FileController } from './file.controller'
import { FileService } from './file.service'

@Module({
  controllers: [FileController],
  imports: [QuoteRecordModule],
  providers: [QuoteRecordService, FileService, AuthService, UserService],
})
export class FileModule {}
