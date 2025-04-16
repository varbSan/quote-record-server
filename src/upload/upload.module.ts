import { Module } from '@nestjs/common'
import { AuthModule } from 'auth/auth.module'
import { QuoteRecordModule } from 'quote-record/quote-record.module'
import { UserModule } from 'user/user.module'
import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'

@Module({
  controllers: [UploadController],
  imports: [QuoteRecordModule, AuthModule, UserModule, QuoteRecordModule],
  providers: [UploadService],
})
export class UploadModule {}
