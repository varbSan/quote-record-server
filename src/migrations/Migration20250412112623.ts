import { Migration } from '@mikro-orm/migrations';

export class Migration20250412112623 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "quote_record" add column "is_public" boolean null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "quote_record" drop column "is_public";`);
  }

}
