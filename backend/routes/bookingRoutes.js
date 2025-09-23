import express from "express";
import { userAuthorization } from "../middlewares/auth.js";
import {
  changeBookingStatus,
  createBooking,
  getMyBookings,
  getOwnerBookings,
  giveAvailableCars,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availablity", giveAvailableCars);
bookingRouter.post("/create", userAuthorization, createBooking);
bookingRouter.get("/user", userAuthorization, getMyBookings);
bookingRouter.get("/owner", userAuthorization, getOwnerBookings);
bookingRouter.post(
  "/change-Status",
  userAuthorization,
  changeBookingStatus
);

export default bookingRouter;
