import Joi from "joi"

export interface CreateProductDto {
  name: string
  price: number
  stock: number
}

export interface UpdateProductDto {
  name?: string
  price?: number
  stock?: number
}

export const createProductSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().integer().required(),
})

export const updateProductSchema = Joi.object({
  name: Joi.string(),
  price: Joi.number(),
  stock: Joi.number().integer(),
})
