import { Router } from "express"
import { login, logout, getCurrentUser } from "./auth.controller"

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     LoginDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email
 *           example: nelson@icomp.com
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *           example: password123
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", login)

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get current user session
 *     responses:
 *       200:
 *         description: User is logged in
 *       401:
 *         description: User is not logged in
 */
router.get("/me", getCurrentUser)

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Log out a user
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Could not log out
 */
router.post("/logout", logout)

export default router
