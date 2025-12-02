import { Router } from "express"
import {
  index,
  createProduct,
  read,
  updateProduct,
  removeProduct,
  reactivateProduct,
} from "./product.controller"
import validate from "../../middlewares/validate"
import isAdmin from "../../middlewares/isAdmin"
import { createProductSchema, updateProductSchema } from "./product.types"

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateProductDto:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - stock
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: integer
 *     UpdateProductDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: integer
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /product:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 */
router.get("/", index)

/**
 * @openapi
 * /product/{id}:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", read)

/**
 * @openapi
 * /product:
 *   post:
 *     tags:
 *       - Product
 *     summary: Create a new product (Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductDto'
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error or product name exists
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.post("/", isAdmin, validate(createProductSchema), createProduct)

/**
 * @openapi
 * /product/{id}:
 *   put:
 *     tags:
 *       - Product
 *     summary: Update a product (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductDto'
 *     responses:
 *       200:
 *         description: Product updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error or product name exists
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.put("/:id", isAdmin, validate(updateProductSchema), updateProduct)

/**
 * @openapi
 * /product/{id}:
 *   delete:
 *     tags:
 *       - Product
 *     summary: Delete a product (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", isAdmin, removeProduct)

/**
 * @openapi
 * /product/{id}/reactivate:
 *   patch:
 *     tags:
 *       - Product
 *     summary: Reactivate a deleted product (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product reactivated
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.patch("/:id/reactivate", isAdmin, reactivateProduct)

export default router
