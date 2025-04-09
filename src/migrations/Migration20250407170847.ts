import { Migration } from '@mikro-orm/migrations';

export class Migration20250407170847 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" drop column "tos_accepted_at";`);

    this.addSql(`alter table "user" add constraint "user_sub_unique" unique ("sub");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_sub_unique";`);

    this.addSql(`alter table "user" add column "tos_accepted_at" timestamptz not null;`);
  }

}
