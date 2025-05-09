import { Module } from '@nestjs/common'
import { StorageModule } from 'storage/storage.module'
import { AiService } from './ai.service'

@Module({
  providers: [AiService],
  imports: [StorageModule],
  exports: [AiService],
})
export class AiModule {}
