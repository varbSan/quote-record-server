import type { User as AuthUser } from '@clerk/express/dist'
import * as process from 'node:process'
import { createClerkClient, verifyToken } from '@clerk/express/dist'
import { JwtPayload } from '@clerk/types/dist'
import { EntityManager } from '@mikro-orm/postgresql'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CreateUser, User } from 'user/user.entity'
import { UserService } from 'user/user.service'
import { CreateUserSchema } from 'user/validation/create-user.schema'
import { safeParse } from 'valibot/dist'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService
  ) {}

  private readonly authClient = createClerkClient({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  })

  async getAuthUser(sub: string): Promise<AuthUser> {
    return this.authClient.users.getUser(sub)
  }

  async linkOrCreateUserFromAuthSession(sessionSub: string, emFork?: EntityManager): Promise<User> {
    let user = await this.userService.findOneBy({ sub: sessionSub }, emFork)
    if (!user) { // create new user if authenticated user does not exist in db yet
      const authUser = await this.getAuthUser(sessionSub)
      const validCreateUser: CreateUser = this.validateAuthUserForCreateUser(authUser)
      user = await this.userService.createUser(validCreateUser, emFork)
    }
    return user
  }

  async getSessionOrFail(token: string): Promise<JwtPayload> {
    const session = await verifyToken(token, {
      authorizedParties: [process.env.CLIENT_URL as string],
      secretKey: process.env.CLERK_SECRET_KEY,
    })

    if (!session || !session.sub) {
      throw new UnauthorizedException('❗ Invalid session')
    }
    return session
  }

  validateAuthUserForCreateUser(authUser: AuthUser) {
    const createUserSchema = {
      email: authUser.primaryEmailAddress?.emailAddress,
      sub: authUser.id,
      username: authUser.username ?? authUser.firstName ?? authUser.lastName,
    }

    const createUserValidated = safeParse(CreateUserSchema, createUserSchema)
    if (!createUserValidated.success) {
      throw new UnauthorizedException('❗ One of the mandatory auth fields was not provided or is invalid ')
    }
    return createUserValidated.output
  }

  parseAuthHeaderOrFail(authHeader: unknown) {
    if (typeof authHeader !== 'string' || !authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('❗ Missing or invalid token')
    }

    const token = authHeader.split(' ')[1]
    return token
  }
}
