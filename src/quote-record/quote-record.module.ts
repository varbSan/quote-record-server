import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { AuthService } from 'auth/auth.service'
import { UserService } from 'user/user.service'
import { WebSocketService } from 'web-socket/web-socket.service'
import { QuoteRecord } from './quote-record.entity'
import { QuoteRecordResolver } from './quote-record.resolver'
import { QuoteRecordService } from './quote-record.service'

@Module({
  imports: [MikroOrmModule.forFeature([QuoteRecord])],
  providers: [QuoteRecordResolver, QuoteRecordService, UserService, WebSocketService, AuthService],
})
export class QuoteRecordModule {}
