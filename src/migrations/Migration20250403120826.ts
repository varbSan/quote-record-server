import { Migration } from '@mikro-orm/migrations';

export class Migration20250403120826 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "quote_record" add constraint "quote_record_text_unique" unique ("text");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "quote_record" drop constraint "quote_record_text_unique";`);
  }

}
