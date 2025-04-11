import * as process from 'node:process'
import { Migrator } from '@mikro-orm/migrations'
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import 'dotenv/config'

export default defineConfig({
  driver: PostgreSqlDriver,
  clientUrl: process.env.DATABASE_URL,
  extensions: [Migrator],
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  debug: process.env.NODE_ENV === 'development',
  metadataProvider: TsMorphMetadataProvider,
})
