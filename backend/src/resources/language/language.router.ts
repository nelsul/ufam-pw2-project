import { Router } from "express"
import { changeLanguage } from "./language.controller"

const router = Router()

/**
 * @openapi
 * /language/change:
 *   post:
 *     tags:
 *       - Language
 *     summary: Change the language cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lang:
 *                 type: string
 *                 example: pt-BR
 *     responses:
 *       200:
 *         description: Language updated
 */
router.post("/change", changeLanguage)

export default router
