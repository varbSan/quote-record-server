import { MikroOrmModule } from '@mikro-orm/nestjs'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { HealthcheckController } from 'healthcheck.controller'
// import { AuthModule } from './auth/auth.module'
import config from './mikro-orm.config'
import { QuoteRecordModule } from './quoteRecord/quoteRecord.module'
import { UserModule } from './user/user.module'

@Module({
  controllers: [HealthcheckController],
  imports: [
    MikroOrmModule.forRoot(config),
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => ({
        playground: false, // no need. use altair graphql client instead
        autoSchemaFile: 'schema.gql',
        debug: configService.get<string>('NODE_ENV') === 'development',
        introspection: configService.get<string>('NODE_ENV') === 'development',
        subscriptions: {
          'graphql-ws': {
            onConnect: () => {
              // eslint-disable-next-line no-console
              console.info('✅ Websocket Client connected')
            },
            onDisconnect: () => {
              // eslint-disable-next-line no-console
              console.info('❎ Websocket Client disconnected')
            },
          },
        },
      }),
    }),
    UserModule,
    // AuthModule,
    QuoteRecordModule,
  ],
})
export class AppModule {}
