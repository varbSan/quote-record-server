import { EntityManager, FilterQuery } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { CreateUserInput } from './inputs/createUser.input'
import { User } from './user.entity'

@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}
  async findOneBy(filter: FilterQuery<User> = {}): Promise<User | null> {
    return this.em.findOne(
      User,
      filter,
    )
  }

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const createdUser = await this.em.create(User, new User(createUserInput))
    await this.em.persistAndFlush(createdUser)
    return createdUser
  }
}
