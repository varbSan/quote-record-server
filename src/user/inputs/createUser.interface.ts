import type { User } from 'user/user.entity'

// TODO: merge .input.ts and .interface.ts. at the moment impossible because of grapqhl-ws mikro-orm cli error
export interface CreateUser {
  email: User['email']
  firstName: User['firstName']
  lastName: User['lastName']
}
