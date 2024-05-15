import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import {createProduct, deleteProduct, getProductById, listProducts, updateProduct} from "../controllers/ProductsController"

const productRouter: Router = Router()

productRouter.post("/create", [authMiddleware, adminMiddleware], errorHandler(createProduct))
productRouter.put("/:id", [authMiddleware, adminMiddleware], errorHandler(updateProduct))
productRouter.delete("/:id", [authMiddleware, adminMiddleware], errorHandler(deleteProduct))
productRouter.get("/", [authMiddleware, adminMiddleware], errorHandler(listProducts))
productRouter.get("/:id", [authMiddleware, adminMiddleware], errorHandler(getProductById))

export default productRouter