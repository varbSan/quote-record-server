import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { AuthService } from 'auth/auth.service'
import { User } from './user.entity'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UserResolver, UserService, AuthService],
  exports: [UserService],
})
export class UserModule {}
