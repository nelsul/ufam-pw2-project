import { Request, Response } from "express"
import {
  create,
  checkEmailExists,
  findAll,
  findOne,
  update as updateService,
  remove as removeService,
} from "./user.service"
import { CreateUserDto, UpdateUserDto } from "./user.types"

export const createUser = async (req: Request, res: Response) => {
  const userDto: CreateUserDto = req.body

  try {
    if (await checkEmailExists(userDto.email)) {
      return res.status(400).json({ message: "Email already exists" })
    }

    const newUser = await create(userDto)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = newUser

    res.status(201).json(userWithoutPassword)
  } catch {
    res.status(500).json({ message: "Internal server error" })
  }
}

export const index = async (req: Request, res: Response) => {
  try {
    const users = await findAll()
    res.status(200).json(users)
  } catch {
    res.status(500).json({ message: "Internal server error" })
  }
}

export const read = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!id) return res.status(400).json({ message: "User ID is required" })

  try {
    const user = await findOne(id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json(user)
  } catch {
    res.status(500).json({ message: "Internal server error" })
  }
}

export const update = async (req: Request, res: Response) => {
  const { id } = req.params
  const userDto: UpdateUserDto = req.body

  if (!id) return res.status(400).json({ message: "User ID is required" })

  try {
    const user = await updateService(id, userDto)
    res.status(200).json(user)
  } catch {
    res.status(500).json({ message: "Internal server error" })
  }
}

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!id) return res.status(400).json({ message: "User ID is required" })

  try {
    await removeService(id)
    res.status(200).json({ message: "User deleted" })
  } catch {
    res.status(500).json({ message: "Internal server error" })
  }
}
