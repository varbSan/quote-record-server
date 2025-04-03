import { Migration } from '@mikro-orm/migrations';

export class Migration20250403094412 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "quote_record" alter column "text" type text using ("text"::text);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "quote_record" alter column "text" type varchar(255) using ("text"::varchar(255));`);
  }

}
