import { Module } from '@nestjs/common'
import { AuthModule } from 'auth/auth.module'
import { QuoteModule } from 'quote/quote.module'
import { UserModule } from 'user/user.module'
import { UploadResolver } from './upload.resolver'
import { UploadService } from './upload.service'

@Module({
  imports: [AuthModule, UserModule, QuoteModule],
  providers: [UploadService, UploadResolver],
  exports: [UploadService],
})
export class UploadModule {}
