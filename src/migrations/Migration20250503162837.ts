import { Migration } from '@mikro-orm/migrations';

export class Migration20250503162837 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "quote" alter column "image_url" type text using ("image_url"::text);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "quote" alter column "image_url" type varchar(255) using ("image_url"::varchar(255));`);
  }

}
