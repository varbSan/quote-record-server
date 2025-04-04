import { Migration } from '@mikro-orm/migrations';

export class Migration20250404133140 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "quote_record" add constraint "quote_record_text_unique" unique ("text");`);
    this.addSql(`alter table "quote_record" add constraint "quote_record_author_id_unique" unique ("author_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "quote_record" drop constraint "quote_record_text_unique";`);
    this.addSql(`alter table "quote_record" drop constraint "quote_record_author_id_unique";`);
  }

}
