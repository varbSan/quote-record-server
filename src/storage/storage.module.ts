import { Module } from '@nestjs/common'
import { AuthModule } from 'auth/auth.module'
import { QuoteModule } from 'quote/quote.module'
import { UserModule } from 'user/user.module'
import { StorageResolver } from './storage.resolver'
import { StorageService } from './storage.service'

@Module({
  imports: [AuthModule, UserModule, QuoteModule],
  providers: [StorageService, StorageResolver],
  exports: [StorageService],
})
export class StorageModule {}
