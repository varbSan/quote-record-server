import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/postgresql'
import { User } from 'user/user.entity'

export type CreateQuote = Pick<Quote, 'user' | 'text' | 'isPublic'>
export type UpdateQuote = Pick<Quote, 'id' | 'user' | 'text' | 'isPublic'>
export type DeleteQuote = Pick<Quote, 'id' | 'user'>

@Entity()
export class Quote extends BaseEntity {
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

  @Property({ type: 'text' })
  imagePrompt?: string

  @Property({ type: 'text' })
  imageUrl?: string

  @Property()
  createdAt = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date()
}
