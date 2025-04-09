import { Migration } from '@mikro-orm/migrations';

export class Migration20250406113439 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" drop column "first_name", drop column "last_name";`);

    this.addSql(`alter table "user" add column "username" varchar(255) not null, add column "sub" varchar(255) not null, add column "tos_accepted_at" timestamptz not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop column "username", drop column "sub", drop column "tos_accepted_at";`);

    this.addSql(`alter table "user" add column "first_name" varchar(255) not null, add column "last_name" varchar(255) not null;`);
  }

}
