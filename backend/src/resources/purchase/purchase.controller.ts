import { Request, Response } from "express"
import {
  getCart,
  addItem,
  finishPurchase,
  removeItem,
} from "./purchase.service"
import { AddProductDto } from "./purchase.types"

export const getCartController = async (req: Request, res: Response) => {
  const userId = req.session.userId

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const cart = await getCart(userId)
    res.status(200).json(cart)
  } catch {
    res.status(500).json({ message: "Internal server error" })
  }
}

export const addItemController = async (req: Request, res: Response) => {
  const userId = req.session.userId
  const addProductDto: AddProductDto = req.body

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const cart = await addItem(userId, addProductDto)
    res.status(200).json(cart)
  } catch (error) {
    if (error instanceof Error && error.message === "Product not found") {
      return res.status(404).json({ message: error.message })
    }
    res.status(500).json({ message: "Internal server error" })
  }
}

export const removeItemController = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const cart = await removeItem(String(req.session.userId), id!)
    res.status(200).json(cart)
  } catch (error) {
    if (error instanceof Error && error.message === "Item not found in cart") {
      return res.status(404).json({ message: error.message })
    }
    res.status(500).json({ message: "Internal server error" })
  }
}

export const finishPurchaseController = async (req: Request, res: Response) => {
  const userId = req.session.userId

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const purchase = await finishPurchase(userId)
    res.status(200).json(purchase)
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "Cart is empty" ||
        error.message.startsWith("Insufficient stock"))
    ) {
      return res.status(400).json({ message: error.message })
    }
    res.status(500).json({ message: "Internal server error" })
  }
}
