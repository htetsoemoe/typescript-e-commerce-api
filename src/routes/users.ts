import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import {createAddress, updateAddress, deleteAddress, getAllAddress} from "../controllers/UserController"

const userRouter: Router = Router()

/** User's address routes */
userRouter.post("/address", [authMiddleware], errorHandler(createAddress))
userRouter.get("/address", [authMiddleware], errorHandler(getAllAddress))
userRouter.put("/address/:id", [authMiddleware], errorHandler(updateAddress))
userRouter.delete("/address/:id", [authMiddleware], errorHandler(deleteAddress))

export default userRouter