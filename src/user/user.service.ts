import type { User as AuthUser } from '@clerk/express'
import { EntityManager, FilterQuery } from '@mikro-orm/postgresql'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from 'auth/auth.service'
import { safeParse } from 'valibot'
import { CreateUser, UpdateUser, User } from './user.entity'
import { CreateUserSchema } from './validation/create-user.schema'

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    private readonly authService: AuthService
  ) {}

  async findOneBy(filter: FilterQuery<User> = {}, em = this.em): Promise<User | null> {
    return em.findOne(
      User,
      filter,
    )
  }

  async createUser(createUser: CreateUser, em = this.em): Promise<User> {
    const createdUser = await em.create(User, new User(createUser))
    await em.persistAndFlush(createdUser)
    return createdUser
  }

  async updateUser(user: User, updateUser: UpdateUser, em = this.em): Promise<User> {
    em.assign(user, updateUser)
    await em.persistAndFlush(user)
    return user
  }

  async findOrCreateBySub(sub: string, emFork?: EntityManager): Promise<User> {
    let user = await this.findOneBy({ sub }, emFork)
    if (!user) {
      const authUser = await this.authService.getUser(sub)
      const validCreateUser = this.validateAuthUserForCreate(authUser)
      user = await this.createUser(validCreateUser, emFork)
    }
    return user
  }

  validateAuthUserForCreate(authUser: AuthUser): CreateUser {
    const createUserSchema = {
      email: authUser.primaryEmailAddress?.emailAddress,
      sub: authUser.id,
      username: authUser.username || authUser.firstName || authUser.lastName || authUser.primaryEmailAddress?.emailAddress,
    }

    const createUserValidated = safeParse(CreateUserSchema, createUserSchema)
    if (!createUserValidated.success) {
      throw new UnauthorizedException('❗ One of the mandatory auth fields was not provided or is invalid ❗')
    }
    return createUserValidated.output
  }
}
