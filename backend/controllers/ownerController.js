import User from "../models/User.js";
import Car from "../models/Owner.js";
import fs from "fs";
import imagekit from "../config/imageKit.js";
import Bookings from "../models/Booking.js";

// Change role to Owner
export const changeRoleToOwner = async (req, res) => {
  const { _id } = req.user;
  try {
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.json({
      message: "Role change to owner & Now you can list your cars",
      success: true,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

// API to list Car

export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;

    let car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    // uploading to ImageKit

    const fileBuffer = fs.readFileSync(imageFile.path);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    // optimized through imageKit URL Transformation

    const optimizedUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    const image = optimizedUrl;

    const newCar = await Car.create({ ...car, owner: _id, image });

    res.json({
      message: "Car Added",
      success: true,
      newCar,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

// getOwnerCars API

export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;

    const cars = await Car.find({ owner: _id });
    if (!cars) {
      res.json({
        message: "No car listed",
        success: false,
      });
    }

    res.json({
      success: true,
      cars,
    });
  } catch (error) {
    res.json({
      message: error.message,
      suucess: false,
    });
  }
};

// Car Availablity Toggle

export const availablityToggle = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const findCar = await Car.findById(carId);

    if (!findCar) {
      res.json({
        message: "No car with this ID",
      });
    }

    if (findCar.owner.toString() !== _id.toString()) {
      res.json({
        message: "UnAuthorize Access",
      });
    }

    findCar.isAvailable = !findCar.isAvailable;
    findCar.save();

    res.json({
      success: true,
      message: "Car status Upadated",
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

// deleteCar from Database API

export const delCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const findCar = await Car.findById(carId);

    if (!findCar) {
      res.json({
        message: "No car with this ID",
      });
    }

    if (findCar.owner.toString() !== _id.toString()) {
      res.json({
        message: "UnAuthorize Access",
      });
    }

    findCar.owner = null;
    findCar.isAvailable = false;
    await findCar.save()

    if (findCar.isAvailable) {
      res.json({
        message: "Smth went wrong!",
        success: false,
      });
    }

    res.json({
      message: "Car Remove Successfully",
      success: true,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

// API to get Dashboard Data

export const getDashBoardData = async (req, res) => {
  try {
    const { _id } = req.user;

    if (!req.user.role === "owner") {
      res.json({
        message: "unAuthorize Access",
      });
    }

    const totalCars = await Car.find({ owner: _id });

    const totalBookings = await Bookings.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    const pendingBookings = await Bookings.find({
      owner: _id,
      status: "pending",
    });
    const confirmedBookings = await Bookings.find({
      owner: _id,
      status: "confirmed",
    });

    // calculate total revenue of owner

    const totalRevenue = (totalBookings || [])
  .filter((booking) => booking.status === "confirmed")
  .reduce((acc, booking) => acc + booking.price, 0);

    const dashboardData = {
      totalCars: totalCars.length,
      totalBookings: totalBookings.length,
      pendingBookings: pendingBookings.length,
      confirmedBookings: confirmedBookings.length,
      recentBookings: totalBookings.slice(0, 3),
      totalRevenue,
    };

    res.json({
      success: true,
      dashboardData,
    });
  } catch (error) {
    message: message.error;
  }
};

// upload User Image to ImageKit

export const uploadImagetoImageKit = async (req, res) => {
  try {
    const { _id } = req.user;
    const imageFile = req.file;

    // Uplaod to ImageKit

    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    // optimized through imageKit URL Transformation

    const optimizedUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "400" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    const image = optimizedUrl;

    await User.findByIdAndUpdate(_id, { image });
    res.json({
      message: "profile image updated successfully",
      success: true,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};
