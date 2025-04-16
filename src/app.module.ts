import { log } from 'node:console'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module, UnauthorizedException } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { AuthModule } from 'auth/auth.module'
import { AuthService } from 'auth/auth.service'
import { HealthcheckController } from 'healthcheck/healthcheck.controller'
import { UploadModule } from 'upload/upload.module'
import { UserService } from 'user/user.service'
import { WebSocketModule } from 'web-socket/web-socket.module'
import { WebSocketService } from 'web-socket/web-socket.service'
import config from './mikro-orm.config'
import { QuoteRecordModule } from './quote-record/quote-record.module'
import { UserModule } from './user/user.module'

@Module({
  controllers: [HealthcheckController],
  imports: [
    AuthModule,
    UserModule,
    UploadModule,
    QuoteRecordModule,
    WebSocketModule,
    MikroOrmModule.forRoot(config),
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule, AuthModule, UserModule, WebSocketModule],
      inject: [ConfigService, AuthService, UserService, WebSocketService],
      driver: ApolloDriver,
      useFactory: (
        configService: ConfigService,
        authService: AuthService,
        userService: UserService,
        webSocketService: WebSocketService,
      ) => ({
        playground: false, // no need. use altair graphql client instead
        autoSchemaFile: 'schema.gql',
        debug: configService.get<string>('NODE_ENV') === 'development',
        introspection: configService.get<string>('NODE_ENV') === 'development',
        subscriptions: {
          'graphql-ws': {
            onConnect: async (context: any) => {
              log('✅ websocket connected for')
              const authHeader = context.connectionParams?.headers?.Authorization ?? ''
              const token = authService.parseHeader(authHeader)
              const session = await authService.getSession(token)

              try {
                const emFork = webSocketService.forkEntityManager()
                const user = await userService.findOrCreateBySub(session.sub, emFork)
                context.userObj = user
                return true
              }
              catch (err) {
                throw new UnauthorizedException(`❗ ${err.message} ❗`)
              }
            },
            onDisconnect: (context: any) => {
              if (!context?.userObj?.id) {
                throw new UnauthorizedException(`❗ Websocket disconnected but context had no user id ❗`)
              }
              log(`❎ websocket disconnected for user id: ${context?.userObj?.id}`)
            },
          },
        },
      }),
    }),
  ],
})
export class AppModule {}
