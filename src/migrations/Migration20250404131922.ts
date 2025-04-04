import { Migration } from '@mikro-orm/migrations';

export class Migration20250404131922 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "quote_record" drop constraint "quote_record_text_unique";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "quote_record" add constraint "quote_record_text_unique" unique ("text");`);
  }

}
