import { Migration } from '@mikro-orm/migrations';

export class Migration20250426083601 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "quote" ("id" serial primary key, "text" text not null, "user_id" int not null, "is_public" boolean null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`alter table "quote" add constraint "quote_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`drop table if exists "quote_record" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "quote_record" ("id" serial primary key, "text" text not null, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, "user_id" int4 not null, "is_public" bool null);`);

    this.addSql(`alter table "quote_record" add constraint "quote_record_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete no action;`);

    this.addSql(`drop table if exists "quote" cascade;`);
  }

}
