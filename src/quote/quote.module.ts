import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { AuthModule } from 'auth/auth.module'
import { UserModule } from 'user/user.module'
import { WebSocketModule } from 'web-socket/web-socket.module'
import { Quote } from './quote.entity'
import { QuoteResolver } from './quote.resolver'
import { QuoteService } from './quote.service'

@Module({
  imports: [MikroOrmModule.forFeature([Quote]), QuoteModule, WebSocketModule, AuthModule, UserModule],
  providers: [QuoteResolver, QuoteService],
  exports: [QuoteService],
})
export class QuoteModule {}
