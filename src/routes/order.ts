import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import { cancelOrder, changeStatus, createOrder, getOrderById, listAllOrders, listOrder, listUserOrders } from "../controllers/OrderController";

const orderRouter: Router = Router()

orderRouter.post("/", [authMiddleware], errorHandler(createOrder))
orderRouter.get("/", [authMiddleware], errorHandler(listOrder))
orderRouter.post("/:id/cancel", [authMiddleware], errorHandler(cancelOrder))
orderRouter.get("/:id", [authMiddleware], errorHandler(getOrderById))
orderRouter.get("/get/all", [authMiddleware, adminMiddleware], errorHandler(listAllOrders))
orderRouter.get("/users/:id", [authMiddleware, adminMiddleware], errorHandler(listUserOrders))
orderRouter.put("/:id/status", [authMiddleware, adminMiddleware], errorHandler(changeStatus))

export default orderRouter