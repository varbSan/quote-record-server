import { EntityManager, FilterQuery } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { CreateUser, User } from './user.entity'

@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}
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
}
