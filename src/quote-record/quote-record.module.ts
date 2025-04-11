import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { AuthModule } from 'auth/auth.module'
import { UserModule } from 'user/user.module'
import { WebSocketModule } from 'web-socket/web-socket.module'
import { QuoteRecord } from './quote-record.entity'
import { QuoteRecordResolver } from './quote-record.resolver'
import { QuoteRecordService } from './quote-record.service'

@Module({
  imports: [MikroOrmModule.forFeature([QuoteRecord]), QuoteRecordModule, WebSocketModule, AuthModule, UserModule],
  providers: [QuoteRecordResolver, QuoteRecordService],
  exports: [QuoteRecordService],
})
export class QuoteRecordModule {}
