import { Request, Response } from "express"
import {
  create,
  findAll,
  findOne,
  update,
  remove,
  checkNameExists,
  reactivate,
} from "./product.service"
import { CreateProductDto, UpdateProductDto } from "./product.types"
import { UserType } from "../../generated/prisma"

export const index = async (req: Request, res: Response) => {
  try {
    const isAdmin = req.session.userType === UserType.ADMIN
    const includeDeleted = isAdmin && req.query.includeDeleted === "true"
    const products = await findAll(includeDeleted)
    res.status(200).json(products)
  } catch {
    res.status(500).json({ message: "Internal server error" })
  }
}

export const createProduct = async (req: Request, res: Response) => {
  const productDto: CreateProductDto = req.body

  try {
    if (await checkNameExists(productDto.name)) {
      return res.status(400).json({ message: "Product name already exists" })
    }

    const newProduct = await create(productDto)
    res.status(201).json(newProduct)
  } catch {
    res.status(500).json({ message: "Internal server error" })
  }
}

export const read = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ message: "Product ID is required" })
  }

  try {
    const product = await findOne(id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.status(200).json(product)
  } catch {
    res.status(500).json({ message: "Internal server error" })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params
  const productDto: UpdateProductDto = req.body

  if (!id) {
    return res.status(400).json({ message: "Product ID is required" })
  }

  try {
    if (productDto.name && (await checkNameExists(productDto.name))) {
      return res.status(400).json({ message: "Product name already exists" })
    }

    const updatedProduct = await update(id, productDto)
    res.status(200).json(updatedProduct)
  } catch {
    res.status(500).json({ message: "Internal server error" })
  }
}

export const removeProduct = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ message: "Product ID is required" })
  }

  try {
    await remove(id)
    res.status(200).json({ message: "Product deleted" })
  } catch {
    res.status(500).json({ message: "Internal server error" })
  }
}

export const reactivateProduct = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ message: "Product ID is required" })
  }

  try {
    await reactivate(id)
    res.status(200).json({ message: "Product reactivated" })
  } catch {
    res.status(500).json({ message: "Internal server error" })
  }
}
