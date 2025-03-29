import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { QuoteRecord } from './quoteRecord.entity'
import { QuoteRecordResolver } from './quoteRecord.resolver'
import { QuoteRecordService } from './quoteRecord.service'

@Module({
  imports: [MikroOrmModule.forFeature([QuoteRecord])],
  providers: [QuoteRecordResolver, QuoteRecordService],
})
export class QuoteRecordModule {}
