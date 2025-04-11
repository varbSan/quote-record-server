import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql/dist'
import { UserService } from 'user/user.service'
import { AuthService } from './auth.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const context = GqlExecutionContext.create(executionContext).getContext()
    const authHeader = context.req?.headers?.authorization
    const token = this.authService.parseHeader(authHeader)
    const session = await this.authService.getSession(token)

    try {
      const user = await this.userService.findOrCreateBySub(session.sub)
      context.userObj = user
      return true
    }
    catch (err) {
      throw new UnauthorizedException(`❗ ${err.message} ❗`)
    }
  }
}
