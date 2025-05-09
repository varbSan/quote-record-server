import type { User } from 'user/user.entity'

export function baseQuoteFilter(user: User) {
  return user.seePublicQuotes
    ? { $or: [{ user }, { isPublic: true }] }
    : { user }
}
