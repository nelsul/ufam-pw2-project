import Joi from "joi"

export interface AddProductDto {
  productId: string
  quantity: number
}

export const addProductSchema = Joi.object({
  productId: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
})
