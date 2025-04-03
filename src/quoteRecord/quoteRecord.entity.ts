import {
  BaseEntity,
  Entity,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/postgresql'

@Entity()
export class QuoteRecord extends BaseEntity {
  @PrimaryKey()
  id!: number

  @Property({ type: 'text' })
  @Unique() // Ensure uniqueness in the database
  text!: string

  @Property({
    type: 'timestamp',
    defaultRaw: 'now()', // PostgreSQL default for new rows
  })
  createdAt!: Date

  @Property({
    type: 'timestamp',
    defaultRaw: 'now()',
    onUpdate: () => new Date(), // Updates on every save
  })
  updatedAt!: Date
}
