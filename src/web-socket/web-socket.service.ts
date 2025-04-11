import { EntityManager } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions/dist'

@Injectable()
export class WebSocketService {
  constructor(
    readonly em: EntityManager
  ) {}

  private pubSub = new PubSub()

  getPubSub() {
    return this.pubSub
  }

  forkEntityManager() {
    return this.em.fork()
  }
}
