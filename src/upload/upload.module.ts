import { Module } from '@nestjs/common'
import { AuthModule } from 'auth/auth.module'
import { QuoteModule } from 'quote/quote.module'
import { UserModule } from 'user/user.module'
import { UploadController } from './upload.controller'
import { UploadResolver } from './upload.resolver'
import { UploadService } from './upload.service'

@Module({
  controllers: [UploadController],
  imports: [QuoteModule, AuthModule, UserModule, QuoteModule],
  providers: [UploadService, UploadResolver],
})
export class UploadModule {}
