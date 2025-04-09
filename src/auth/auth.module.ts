import { Module } from '@nestjs/common'
import { UserService } from 'user/user.service'
import { AuthService } from './auth.service'

@Module({
  providers: [AuthService, UserService],
  exports: [AuthService],
})
export class AuthModule {}
