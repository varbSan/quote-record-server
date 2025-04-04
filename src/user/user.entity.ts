import {
  BaseEntity,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/postgresql'
import { QuoteRecord } from 'quoteRecord/quoteRecord.entity'
import { CreateUser } from './inputs/createUser.interface'

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
  firstName!: string

  @Property()
  lastName!: string

  @OneToMany(() => QuoteRecord, quoteRecord => quoteRecord.author)
  quoteRecords = new Collection<QuoteRecord>(this)

  @Property()
  createdAt = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date()
}
