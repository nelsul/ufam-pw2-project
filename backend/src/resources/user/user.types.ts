import { UserType } from "../../generated/prisma"
import Joi from "joi"

export interface CreateUserDto {
  name: string
  email: string
  password: string
  userType: UserType
}

export interface UpdateUserDto {
  name?: string
  email?: string
  password?: string
  userType?: UserType
}

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  userType: Joi.string().valid(...Object.values(UserType)),
})
