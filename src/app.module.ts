import type { Context } from 'graphql-ws'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { EntityManager } from '@mikro-orm/postgresql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module, UnauthorizedException } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { AuthModule } from 'auth/auth.module'
import { AuthService } from 'auth/auth.service'
import { FileModule } from 'file/file.module'
import { HealthcheckController } from 'healthcheck/healthcheck.controller'
import { WebSocketModule } from 'web-socket/web-socket.module'
import config from './mikro-orm.config'
import { QuoteRecordModule } from './quote-record/quote-record.module'
import { UserModule } from './user/user.module'

@Module({
  controllers: [HealthcheckController],
  imports: [
    AuthModule,
    UserModule,
    FileModule,
    QuoteRecordModule,
    WebSocketModule,
    MikroOrmModule.forRoot(config),
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule, AuthModule],
      inject: [ConfigService, AuthService, EntityManager],
      driver: ApolloDriver,
      useFactory: (
        configService: ConfigService,
        authService: AuthService,
        em: EntityManager,
      ) => ({
        playground: false, // no need. use altair graphql client instead
        autoSchemaFile: 'schema.gql',
        debug: configService.get<string>('NODE_ENV') === 'development',
        introspection: configService.get<string>('NODE_ENV') === 'development',
        subscriptions: {
          'graphql-ws': {
            onConnect: async (ctx: any) => {
              const authHeader = ctx.connectionParams?.headers?.Authorization ?? ''
              const token = authService.parseAuthHeaderOrFail(authHeader)
              const session = await authService.getSessionOrFail(token)
              const emFork = em.fork()

              try {
                const user = await authService.linkOrCreateUserFromAuthSession(session.sub, emFork)
                ctx.userObj = user
                return true
              }
              catch (err) {
                throw new UnauthorizedException(`❗ ${err.message}`)
              }
            },
            onDisconnect: () => {
              // eslint-disable-next-line no-console
              console.info('❎ Websocket Client disconnected')
            },
          },
        },
      }),
    }),
  ],
})
export class AppModule {}
