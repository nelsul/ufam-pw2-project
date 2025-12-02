import { User } from "../../generated/prisma"
import prisma from "../../utils/prisma"
import { CreateUserDto, UpdateUserDto } from "./user.types"
import bcrypt from "bcryptjs"

export const checkEmailExists = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { email } })
  return !!user
}

export const create = async (user: CreateUserDto): Promise<User> => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(user.password, salt)

  return prisma.user.create({
    data: {
      ...user,
      password: hashedPassword,
    },
  })
}

export const findAll = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      userType: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export const findOne = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      userType: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export const update = async (id: string, data: UpdateUserDto) => {
  if (data.password) {
    const salt = await bcrypt.genSalt(10)
    data.password = await bcrypt.hash(data.password, salt)
  }

  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      userType: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export const remove = async (id: string) => {
  return prisma.user.delete({
    where: { id },
  })
}
