import { Module } from '@nestjs/common'
import { AuthModule } from 'auth/auth.module'
import { QuoteRecordModule } from 'quote-record/quote-record.module'
import { UserModule } from 'user/user.module'
import { FileController } from './file.controller'
import { FileService } from './file.service'

@Module({
  controllers: [FileController],
  imports: [QuoteRecordModule, AuthModule, UserModule, QuoteRecordModule],
  providers: [FileService],
})
export class FileModule {}
