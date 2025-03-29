import {
  BaseEntity,
  Entity,
  Opt,
  PrimaryKey,
  Property,
} from '@mikro-orm/postgresql'

@Entity()
export class QuoteRecord extends BaseEntity {
  @PrimaryKey()
  id!: number

  @Property()
  text!: string

  @Property()
  createdAt: Date & Opt = new Date()

  @Property()
  updatedAt: Date & Opt = new Date()
}
