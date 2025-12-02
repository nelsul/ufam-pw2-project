import prisma from "../../utils/prisma"
import { LoginDto } from "./auth.types"
import bcrypt from "bcryptjs"
import { User } from "../../generated/prisma"

export const authenticate = async (
  credentials: LoginDto,
): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  })

  if (!user) {
    return null
  }

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.password,
  )

  if (!isPasswordValid) {
    return null
  }

  return user
}
