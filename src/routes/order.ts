import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import { cancelOrder, createOrder, getOrderById, listOrder } from "../controllers/OrderController";

const orderRouter: Router = Router()

orderRouter.post("/", [authMiddleware], errorHandler(createOrder))
orderRouter.get("/", [authMiddleware], errorHandler(listOrder))
orderRouter.post("/:id/cancel", [authMiddleware], errorHandler(cancelOrder))
orderRouter.get("/:id", [authMiddleware], errorHandler(getOrderById))

export default orderRouter