import * as process from 'node:process'
import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Enable CORS for API calls
  app.enableCors({ origin: process.env.CLIENT_URL, credentials: true })

  // Global Validation (Optional)
  app.useGlobalPipes(new ValidationPipe())

  // Start the server
  const port = process.env.PORT || 3000
  await app.listen(port)

  Logger.log(`🚀 http server running on port: ${port}`)
}
void bootstrap()
