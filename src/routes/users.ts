import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import {createAddress, updateAddress, deleteAddress, getAllAddress, 
        listUsers, updateUser, getUserById, changeUserRole} from "../controllers/UserController"

const userRouter: Router = Router()

/** User routes */
userRouter.get("/", [authMiddleware, adminMiddleware], errorHandler(listUsers))
userRouter.put("/", [authMiddleware, adminMiddleware], errorHandler(updateUser))
userRouter.get("/:id", [authMiddleware, adminMiddleware], errorHandler(getUserById))
userRouter.put("/:id", [authMiddleware, adminMiddleware], errorHandler(changeUserRole))

/** User's address routes */
userRouter.post("/address", [authMiddleware], errorHandler(createAddress))
userRouter.get("/address", [authMiddleware], errorHandler(getAllAddress))
userRouter.put("/address/:id", [authMiddleware], errorHandler(updateAddress))
userRouter.delete("/address/:id", [authMiddleware], errorHandler(deleteAddress))

export default userRouter