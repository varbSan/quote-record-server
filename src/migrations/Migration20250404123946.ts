import { Migration } from '@mikro-orm/migrations';

export class Migration20250404123946 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" serial primary key, "email" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`alter table "quote_record" add column "author_id" int not null;`);
    this.addSql(`alter table "quote_record" add constraint "quote_record_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "quote_record" drop constraint "quote_record_author_id_foreign";`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`alter table "quote_record" drop column "author_id";`);
  }

}
