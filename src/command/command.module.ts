import * as process from 'node:process'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SetCorsBucketCommand } from './set-cors-bucket.command'

@Module({
  providers: [SetCorsBucketCommand],
  imports: [ConfigModule.forRoot({
    envFilePath: `.env.${process.env.NODE_ENV}.local`,
  })],
})
export class CommandModule {}
