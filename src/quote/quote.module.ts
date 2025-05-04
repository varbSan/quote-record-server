import { MikroOrmModule } from '@mikro-orm/nestjs'
import { forwardRef, Module } from '@nestjs/common'
import { AiModule } from 'ai/ai.module'
import { AuthModule } from 'auth/auth.module'
import { UploadModule } from 'upload/upload.module'
import { UserModule } from 'user/user.module'
import { WebSocketModule } from 'web-socket/web-socket.module'
import { Quote } from './quote.entity'
import { QuoteResolver } from './quote.resolver'
import { QuoteService } from './quote.service'

@Module({
  imports: [
    MikroOrmModule.forFeature([Quote]),
    QuoteModule,
    WebSocketModule,
    AuthModule,
    UserModule,
    forwardRef(() => UploadModule),
    forwardRef(() => AiModule),
  ],
  providers: [QuoteResolver, QuoteService],
  exports: [QuoteService],
})
export class QuoteModule {}
