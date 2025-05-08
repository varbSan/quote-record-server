import { Migration } from '@mikro-orm/migrations';

export class Migration20250508155503 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "see_public_quotes" boolean null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop column "see_public_quotes";`);
  }

}
