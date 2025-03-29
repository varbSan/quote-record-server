import * as bcrypt from 'bcryptjs'

export async function createHashedPassword(
  plainTextPassword: string,
  saltRounds = 10,
): Promise<string> {
  return bcrypt.hash(plainTextPassword, saltRounds)
}
