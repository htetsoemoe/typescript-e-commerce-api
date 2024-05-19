import { Router } from "express";
import authRoutes from "./auth";
import productRoutes from "./products"
import userRouter from "./users";
import cartRouter from "./cart";

const rootRouter: Router = Router()

rootRouter.use('/auth', authRoutes)
rootRouter.use('/products', productRoutes)
rootRouter.use('/user', userRouter)
rootRouter.use('/cart', cartRouter)

export default rootRouter