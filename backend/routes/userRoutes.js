import express from "express"
import { getAllCars, getUser, userLogin, userRegister } from "../controllers/userController.js";
import { userAuthorization } from "../middlewares/auth.js";


const userRouter = express.Router();


userRouter.post("/register", userRegister)
userRouter.post("/login", userLogin)
userRouter.get("/data", userAuthorization, getUser)
userRouter.get("/cars", getAllCars)

export default userRouter;