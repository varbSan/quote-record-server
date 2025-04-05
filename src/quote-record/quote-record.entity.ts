import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/postgresql'
import { User } from 'user/user.entity'
import { CreateQuoteRecord } from './inputs/create-quote-record.interface'

@Entity()
export class QuoteRecord extends BaseEntity {
  constructor(input: CreateQuoteRecord) {
    super()
    Object.assign(this, input)
  }

  @PrimaryKey()
  id!: number

  @Property({ type: 'text' })
  text!: string

  @ManyToOne(() => User)
  author!: User

  @Property()
  createdAt = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date()
}
