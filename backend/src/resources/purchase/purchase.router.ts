import { Router } from "express"
import {
  getCartController,
  addItemController,
  finishPurchaseController,
  removeItemController,
} from "./purchase.controller"
import validate from "../../middlewares/validate"
import { addProductSchema } from "./purchase.types"

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     AddProductDto:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           format: uuid
 *         quantity:
 *           type: integer
 *           minimum: 1
 *     PurchaseItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         productId:
 *           type: string
 *         quantity:
 *           type: integer
 *         price:
 *           type: number
 *     Purchase:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         status:
 *           type: string
 *           enum: [OPEN, COMPLETED]
 *         total:
 *           type: number
 *         purchaseItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PurchaseItem'
 */

/**
 * @openapi
 * /purchase:
 *   get:
 *     tags:
 *       - Purchase
 *     summary: Get current shopping cart
 *     responses:
 *       200:
 *         description: Current cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Purchase'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", getCartController)

/**
 * @openapi
 * /purchase/add:
 *   post:
 *     tags:
 *       - Purchase
 *     summary: Add item to cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddProductDto'
 *     responses:
 *       200:
 *         description: Item added, returns updated cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Purchase'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.post("/add", validate(addProductSchema), addItemController)

/**
 * @openapi
 * /purchase/item/{id}:
 *   delete:
 *     tags:
 *       - Purchase
 *     summary: Remove item from cart
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Purchase Item ID
 *     responses:
 *       200:
 *         description: Item removed, returns updated cart
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */
router.delete("/item/:id", removeItemController)

/**
 * @openapi
 * /purchase/finish:
 *   post:
 *     tags:
 *       - Purchase
 *     summary: Finish purchase (Checkout)
 *     responses:
 *       200:
 *         description: Purchase completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Purchase'
 *       400:
 *         description: Cart is empty or insufficient stock
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/finish", finishPurchaseController)

export default router
