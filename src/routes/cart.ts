import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import { addItemToCart, deleteItemFromCart, changeQuantity, getCart } from "../controllers/CartController";

const cartRouter: Router = Router()

cartRouter.post("/", [authMiddleware], errorHandler(addItemToCart))
cartRouter.get("/", [authMiddleware], errorHandler(getCart))
cartRouter.put("/:id", [authMiddleware], errorHandler(changeQuantity))
cartRouter.delete("/:id", [authMiddleware], errorHandler(deleteItemFromCart))

export default cartRouter