import {
  Args,
  Mutation,
  // Query,
  Resolver,
  // Mutation, Args
} from '@nestjs/graphql'
import { CreateUserInput } from './inputs/create-user.input'
import { User } from './user.entity'
// import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service'
import { UserType } from './user.type'
// import { GqlAuthGuard } from '../auth/guards/graphql-auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserType)
  createUser(
    @Args('createUserInput', { type: () => CreateUserInput }) CreateUserInput: CreateUserInput,
  ) {
    return this.userService.createUser(CreateUserInput)
  }

  // @UseGuards(GqlAuthGuard)
  // @Query(() => String)
  // getProfile() {
  //   return 'This is a protected profile route';
  // }
}
