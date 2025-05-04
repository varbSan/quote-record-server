import type { User as AuthUser } from '@clerk/express'
import { ClerkClient, createClerkClient, verifyToken } from '@clerk/express'
import { JwtPayload } from '@clerk/types'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  private readonly authClient: ClerkClient

  constructor(
    private readonly configService: ConfigService
  ) {
    this.authClient = createClerkClient({
      publishableKey: this.configService.get<string>('CLERK_PUBLISHABLE_KEY'),
      secretKey: this.configService.get<string>('CLERK_SECRET_KEY'),
    })
  }

  async getUser(userId: string): Promise<AuthUser> {
    const authUser = await this.authClient.users.getUser(userId)

    if (!authUser) {
      throw new UnauthorizedException('❗ User not found or id is not matching ❗')
    }
    return authUser
  }

  async getSession(token: string): Promise<JwtPayload> {
    const session = await verifyToken(token, {
      authorizedParties: [this.configService.get<string>('CLIENT_URL')!],
      secretKey: this.configService.get<string>('CLERK_SECRET_KEY'),
    })

    if (!session || !session.sub) {
      throw new UnauthorizedException('❗ Invalid session ❗')
    }
    return session
  }

  parseHeader(authHeader: unknown) {
    if (typeof authHeader !== 'string' || !authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('❗ Missing or invalid token ❗')
    }

    const token = authHeader.split(' ')[1]
    return token
  }
}
