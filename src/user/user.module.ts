import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { User } from './user.entity'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UserResolver, UserService], // ✅ Ensure these are provided
  exports: [UserService],
})
export class UserModule {}
