import { Migration } from '@mikro-orm/migrations';

export class Migration20250408101411 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "quote_record" drop constraint "quote_record_author_id_foreign";`);

    this.addSql(`alter table "quote_record" rename column "author_id" to "user_id";`);
    this.addSql(`alter table "quote_record" add constraint "quote_record_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "quote_record" drop constraint "quote_record_user_id_foreign";`);

    this.addSql(`alter table "quote_record" rename column "user_id" to "author_id";`);
    this.addSql(`alter table "quote_record" add constraint "quote_record_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;`);
  }

}
