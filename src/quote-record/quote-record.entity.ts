import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/postgresql'
import { User } from 'user/user.entity'

export type CreateQuote = Pick<QuoteRecord, 'user' | 'text' | 'isPublic'>
export type UpdateQuote = Pick<QuoteRecord, | 'id' | 'user' | 'text'>
export type DeleteQuote = Pick<QuoteRecord, 'id' | 'user'>

@Entity()
export class QuoteRecord extends BaseEntity {
  constructor(input: CreateQuote) {
    super()
    Object.assign(this, input)
  }

  @PrimaryKey()
  id!: number

  @Property({ type: 'text' })
  text!: string

  @ManyToOne(() => User)
  user!: User

  @Property()
  isPublic?: boolean

  @Property()
  createdAt = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date()
}
