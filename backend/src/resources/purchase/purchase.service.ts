import { PurchaseStatus, Prisma } from "../../generated/prisma"
import prisma from "../../utils/prisma"
import { AddProductDto } from "./purchase.types"

type PurchaseWithItems = Prisma.PurchaseGetPayload<{
  include: { purchaseItems: { include: { product: true } } }
}>

export const getCart = async (userId: string): Promise<PurchaseWithItems> => {
  let cart = await prisma.purchase.findFirst({
    where: {
      userId,
      status: PurchaseStatus.OPEN,
    },
    include: {
      purchaseItems: {
        include: {
          product: true,
        },
      },
    },
  })

  if (!cart) {
    cart = await prisma.purchase.create({
      data: {
        userId,
        status: PurchaseStatus.OPEN,
        total: 0,
      },
      include: {
        purchaseItems: {
          include: {
            product: true,
          },
        },
      },
    })
  }

  return cart
}

export const addItem = async (
  userId: string,
  addProductDto: AddProductDto,
): Promise<PurchaseWithItems> => {
  const { productId, quantity } = addProductDto

  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    throw new Error("Product not found")
  }

  const cart = await getCart(userId)

  const existingItem = await prisma.purchaseItem.findFirst({
    where: {
      purchaseId: cart.id,
      productId,
    },
  })

  if (existingItem) {
    await prisma.purchaseItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    })
  } else {
    await prisma.purchaseItem.create({
      data: {
        purchaseId: cart.id,
        productId,
        quantity,
        price: product.price,
      },
    })
  }

  const updatedItems = await prisma.purchaseItem.findMany({
    where: { purchaseId: cart.id },
  })

  const newTotal = updatedItems.reduce((acc, item) => {
    return acc + Number(item.price) * item.quantity
  }, 0)

  return prisma.purchase.update({
    where: { id: cart.id },
    data: { total: newTotal },
    include: {
      purchaseItems: {
        include: {
          product: true,
        },
      },
    },
  })
}

export const removeItem = async (
  userId: string,
  purchaseItemId: string,
): Promise<PurchaseWithItems> => {
  const cart = await getCart(userId)

  const item = await prisma.purchaseItem.findFirst({
    where: { id: purchaseItemId, purchaseId: cart.id },
  })

  if (!item) {
    throw new Error("Item not found in cart")
  }

  await prisma.purchaseItem.delete({
    where: { id: purchaseItemId },
  })

  const updatedItems = await prisma.purchaseItem.findMany({
    where: { purchaseId: cart.id },
  })

  const newTotal = updatedItems.reduce((acc, item) => {
    return acc + Number(item.price) * item.quantity
  }, 0)

  return prisma.purchase.update({
    where: { id: cart.id },
    data: { total: newTotal },
    include: {
      purchaseItems: {
        include: {
          product: true,
        },
      },
    },
  })
}

export const finishPurchase = async (
  userId: string,
): Promise<PurchaseWithItems> => {
  const cart = await getCart(userId)

  if (cart.purchaseItems.length === 0) {
    throw new Error("Cart is empty")
  }

  for (const item of cart.purchaseItems) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    })
    if (!product || product.stock < item.quantity) {
      throw new Error(
        `Insufficient stock for product ${product?.name ?? item.productId}`,
      )
    }
  }

  for (const item of cart.purchaseItems) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    })
  }

  return prisma.purchase.update({
    where: { id: cart.id },
    data: { status: PurchaseStatus.COMPLETED },
    include: {
      purchaseItems: {
        include: {
          product: true,
        },
      },
    },
  })
}
