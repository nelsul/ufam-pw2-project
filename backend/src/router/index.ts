import { Router } from "express"
import userRouter from "../resources/user/user.router"
import authRouter from "../resources/auth/auth.router"
import productRouter from "../resources/product/product.router"
import languageRouter from "../resources/language/language.router"
import purchaseRouter from "../resources/purchase/purchase.router"
import setLangCookie from "../middlewares/setLangCookie"

const router = Router()

router.use(setLangCookie)

router.use("/user", userRouter)
router.use("/auth", authRouter)
router.use("/product", productRouter)
router.use("/language", languageRouter)
router.use("/purchase", purchaseRouter)

export default router
