import { UseGuards } from '@nestjs/common'
import {
  Args,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql'
import { AuthGuard } from 'auth/auth.guard'
import { CurrentUser } from 'decorators/current-user.decorator'
import { CreateUserInput } from './graphql/create-user.input'
import { UserType } from './graphql/user.type'
import { User } from './user.entity'
import { UserService } from './user.service'

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

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
}
