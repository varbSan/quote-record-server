import { Migration } from '@mikro-orm/migrations';

export class Migration20250503154947 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "quote" add column "image_prompt" text null, add column "image_url" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "quote" drop column "image_prompt", drop column "image_url";`);
  }

}
