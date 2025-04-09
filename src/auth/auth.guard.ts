import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql/dist'
import { AuthService } from './auth.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext()
    const authHeader = ctx.req?.headers?.authorization
    const token = this.authService.parseAuthHeaderOrFail(authHeader)
    const session = await this.authService.getSessionOrFail(token)

    try {
      const user = await this.authService.linkOrCreateUserFromAuthSession(session.sub)
      ctx.userObj = user
      return true
    }
    catch (err) {
      throw new UnauthorizedException(`❗ ${err.message}`)
    }
  }
}
