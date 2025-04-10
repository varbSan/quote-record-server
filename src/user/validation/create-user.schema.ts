import { object, string } from 'valibot'

export const CreateUserSchema = object({
  email: string(),
  sub: string(),
  username: string(),
})
