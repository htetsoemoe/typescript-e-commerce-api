import { Router } from "express";
import authRoutes from "./auth";
import productRoutes from "./products"
import userRouter from "./users";
import cartRouter from "./cart";
import orderRouter from "./order";

const rootRouter: Router = Router()

rootRouter.use('/auth', authRoutes)
rootRouter.use('/products', productRoutes)
rootRouter.use('/user', userRouter)
rootRouter.use('/cart', cartRouter)
rootRouter.use('/order', orderRouter)

export default rootRouter