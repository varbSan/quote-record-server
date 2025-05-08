import { MikroOrmModule } from '@mikro-orm/nestjs'
import { forwardRef, Module } from '@nestjs/common'
import { AuthModule } from 'auth/auth.module'
import { QuoteModule } from 'quote/quote.module'
import { User } from './user.entity'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'

@Module({
  imports: [MikroOrmModule.forFeature([User]), AuthModule, forwardRef(() => QuoteModule)],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
