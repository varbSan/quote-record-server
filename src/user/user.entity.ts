import {
  BaseEntity,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/postgresql'
import { Quote } from 'quote/quote.entity'

export type CreateUser = Pick<User, 'email' | 'sub' | 'username'>
export type UpdateUser = Pick<User, 'seePublicQuotes'>

@Entity()
export class User extends BaseEntity {
  constructor(input: CreateUser) {
    super()
    Object.assign(this, input)
  }

  @PrimaryKey()
  id!: number

  @Property()
  @Unique() // Ensure uniqueness in the database
  email!: string

  @Property()
  username!: string

  @Property()
  @Unique() // Ensure uniqueness in the database
  sub!: string

  @OneToMany(() => Quote, quote => quote.user)
  quotes = new Collection<Quote>(this)

  @Property()
  seePublicQuotes?: boolean

  @Property()
  createdAt = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date()
}
