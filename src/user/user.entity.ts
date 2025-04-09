import {
  BaseEntity,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/postgresql'
import { QuoteRecord } from 'quote-record/quote-record.entity'

export type CreateUser = Pick<User, 'email' | 'sub' | 'username'>

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

  @OneToMany(() => QuoteRecord, quoteRecord => quoteRecord.user)
  quoteRecords = new Collection<QuoteRecord>(this)

  @Property()
  createdAt = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date()
}
