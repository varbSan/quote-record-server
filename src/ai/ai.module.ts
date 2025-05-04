import { Module } from '@nestjs/common'
import { UploadModule } from 'upload/upload.module'
import { AiService } from './ai.service'

@Module({
  providers: [AiService],
  imports: [UploadModule],
  exports: [AiService],
})
export class AiModule {}
