import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { UserService } from 'user/user.service'
import { QuoteRecord } from './quote-record.entity'
import { QuoteRecordResolver } from './quote-record.resolver'
import { QuoteRecordService } from './quote-record.service'

@Module({
  imports: [MikroOrmModule.forFeature([QuoteRecord])],
  providers: [QuoteRecordResolver, QuoteRecordService, UserService],
})
export class QuoteRecordModule {}
