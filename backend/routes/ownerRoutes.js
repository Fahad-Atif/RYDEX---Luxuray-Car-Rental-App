import express from "express";
import {
  addCar,
  availablityToggle,
  changeRoleToOwner,
  delCar,
  getDashBoardData,
  getOwnerCars,
  uploadImagetoImageKit,
} from "../controllers/ownerController.js";
import { userAuthorization } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", userAuthorization, changeRoleToOwner);
ownerRouter.post("/add-car", upload.single("image"), userAuthorization, addCar);
ownerRouter.get("/cars", userAuthorization, getOwnerCars);
ownerRouter.post("/toggel-car", userAuthorization, availablityToggle);
ownerRouter.post("/delete-car", userAuthorization, delCar);
ownerRouter.get("/dasboard", userAuthorization, getDashBoardData);
ownerRouter.post(
  "/update-image",
  upload.single("image"),
  userAuthorization,
  uploadImagetoImageKit
);

export default ownerRouter;
