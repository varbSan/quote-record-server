// src/user/user.service.ts
import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { createHashedPassword } from '../utils/bcrypt'
import { User } from './user.model'

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      hashedPassword: '$2b$10$abcdefg1234567890', // Hashed password
    },
    {
      id: 2,
      name: 'Foo bar',
      email: 'foo@example.com',
      hashedPassword: '$2b$10$abcdefg1234567891', // Hashed password
    },
  ]

  getUsers(): User[] {
    return this.users
  }

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const hashedPassword = await createHashedPassword(password)
    const user = {
      id: this.users.length + 1,
      name,
      email,
      hashedPassword,
    }

    this.users.push(user)
    return user
  }

  // make async afterward
  findOne(username: string) {
    return this.users.find(user => user.name === username)
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = this.findOne(username)
    if (user && (await bcrypt.compare(password, user.hashedPassword))) {
      return user
    }
    return null
  }
}
