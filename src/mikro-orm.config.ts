import * as process from 'node:process'
import { Migrator } from '@mikro-orm/migrations'
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import 'dotenv/config'

export default defineConfig({
  driver: PostgreSqlDriver,
  clientUrl: process.env.DATABASE_URL,
  extensions: [Migrator],
  entities: ['./dist/**/*.entity.js'], // Ensure this path is correct for your project structure
  entitiesTs: ['./src/**/*.entity.ts'], // Ensure this path is correct for your project structure
  debug: process.env.NODE_ENV === 'development',
  metadataProvider: TsMorphMetadataProvider,
})
