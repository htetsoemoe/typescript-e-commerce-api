import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import {createProduct} from "../controllers/ProductsController"

const productRouter: Router = Router()

productRouter.post("/create", [authMiddleware, adminMiddleware], errorHandler(createProduct))

export default productRouter