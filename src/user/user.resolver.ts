import { UseGuards } from '@nestjs/common'
import {
  Args,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { AuthGuard } from 'auth/auth.guard'
import { CurrentUser } from 'decorators/current-user.decorator'
import { QuoteService } from 'quote/quote.service'
import { CreateUserInput } from './graphql/create-user.input'
import { UserType } from './graphql/user.type'
import { User } from './user.entity'
import { UserService } from './user.service'

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly quoteService: QuoteService
  ) {}

  @Mutation(() => UserType)
  createUser(
    @Args('createUserInput', { type: () => CreateUserInput }) createUserInput: CreateUserInput,
  ) {
    return this.userService.createUser(createUserInput)
  }

  @UseGuards(AuthGuard)
  @Query(() => UserType)
  async getCurrentUser(@CurrentUser() user: User) {
    return user
  }

  @ResolveField('quoteCount', () => Int)
  async quoteCount(
    @CurrentUser() currentUser: User,
  ) {
    const filter = currentUser.seePublicQuotes
      ? { $or: [{ user: currentUser }, { isPublic: true }] }
      : { user: currentUser }
    return this.quoteService.getCount(filter)
  }
}
