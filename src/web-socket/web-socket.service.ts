import { Injectable } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions/dist'

@Injectable()
export class WebSocketService {
  private pubSub = new PubSub()

  getPubSub() {
    return this.pubSub
  }
}
