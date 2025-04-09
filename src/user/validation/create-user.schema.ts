import { object, string } from 'valibot/dist'

export const CreateUserSchema = object({
  email: string(),
  sub: string(),
  username: string(),
})
