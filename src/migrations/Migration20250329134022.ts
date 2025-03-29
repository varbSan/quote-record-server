import { Migration } from '@mikro-orm/migrations';

export class Migration20250329134022 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "quote_record" ("id" serial primary key, "text" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "quote_record" cascade;`);
  }

}
