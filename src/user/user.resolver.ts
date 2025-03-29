// src/user/user.resolver.ts
import {
  Query,
  Resolver,
  // Mutation, Args
} from '@nestjs/graphql'
import { User } from './user.model'
// import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service'
// import { GqlAuthGuard } from '../auth/guards/graphql-auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String) // ✅ Required Query
  hello() {
    return 'Hello, GraphQL!'
  }

  // @Query(() => [User])
  // getUsers() {
  //   return this.userService.getUsers();
  // }

  // @Mutation(() => User)
  // createUser(
  //   @Args('name') name: string,
  //   @Args('email') email: string,
  //   @Args('password') password: string,
  // ) {
  //   return this.userService.createUser(name, email, password);
  // }

  // @UseGuards(GqlAuthGuard)
  // @Query(() => String)
  // getProfile() {
  //   return 'This is a protected profile route';
  // }
}
