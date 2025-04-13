import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/postgresql'
import { User } from 'user/user.entity'

export type CreateQuoteRecord = Pick<QuoteRecord, 'text' | 'user' | 'isPublic'>

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
  user!: User

  @Property()
  isPublic?: boolean

  @Property()
  createdAt = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date()
}
