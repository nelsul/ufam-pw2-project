import { Product, PurchaseStatus } from "../../generated/prisma"
import prisma from "../../utils/prisma"
import { CreateProductDto, UpdateProductDto } from "./product.types"

export const checkNameExists = async (name: string): Promise<boolean> => {
  const product = await prisma.product.findUnique({ where: { name } })
  return !!product
}

export const create = async (product: CreateProductDto): Promise<Product> => {
  return prisma.product.create({ data: product })
}

export const findAll = async (includeDeleted = false): Promise<Product[]> => {
  const where = includeDeleted ? {} : { deletedAt: null }
  return prisma.product.findMany({ where })
}

export const findOne = async (id: string): Promise<Product | null> => {
  return prisma.product.findFirst({ where: { id } })
}

export const reactivate = async (id: string): Promise<Product> => {
  return prisma.product.update({ where: { id }, data: { deletedAt: null } })
}

export const update = async (
  id: string,
  product: UpdateProductDto,
): Promise<Product> => {
  return prisma.product.update({ where: { id }, data: product })
}

export const remove = async (id: string): Promise<Product> => {
  const deletedProduct = await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  })

  const activePurchasesWithProduct = await prisma.purchase.findMany({
    where: {
      status: PurchaseStatus.OPEN,
      purchaseItems: {
        some: {
          productId: id,
        },
      },
    },
    include: {
      purchaseItems: true,
    },
  })

  for (const purchase of activePurchasesWithProduct) {
    await prisma.purchaseItem.deleteMany({
      where: {
        purchaseId: purchase.id,
        productId: id,
      },
    })

    const remainingItems = await prisma.purchaseItem.findMany({
      where: { purchaseId: purchase.id },
    })

    const newTotal = remainingItems.reduce((acc, item) => {
      return acc + Number(item.price) * item.quantity
    }, 0)

    await prisma.purchase.update({
      where: { id: purchase.id },
      data: { total: newTotal },
    })
  }

  return deletedProduct
}
