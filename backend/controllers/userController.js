import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Car from "../models/Owner.js";

// Generating token Function

function generateToken(userId) {
  const payload = userId;

  return jwt.sign(payload, process.env.JWT_SECRET);
}

//User Registration Controller

export const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
      return res.json({
        success: false,
        message: "Fill all the fields & Password must be 8 characters long",
      });
    }

    const alreadyExits = await User.findOne({ email });

    if (alreadyExits) {
      return res.json({
        success: false,
        message: "User already exist with this Email",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const token = generateToken(newUser._id.toString());

    return res.json({
      success: true,
      message: "User Successfully Registered!",
      token,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      error: error.message,
    });
  }
};

// Login User

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Please fill all inputs",
      });
    }

    const findUser = await User.findOne({
      email,
    });

    if (!findUser) {
      return res.json({
        success: false,
        message: "Please Register First!",
      });
    }

    const unHashPassword = await bcrypt.compare(password, findUser.password);

    if (!unHashPassword) {
      return res.json({
        success: false,
        message: "Wrong Credentials!!",
      });
    }

    const token = generateToken(findUser._id.toString());

    return res.json({
      success: true,
      message: "User Successfully Login!",
      token,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      error: error.message,
    });
  }
};

//  Get login User Data

export const getUser = (req, res) => {
  try {
    const { user } = req;
    res.json({ user, success: true });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const getAllCars = async (req, res) => {
  try {
    const allCars = await Car.find({ isAvailable: true });
    res.json({ allCars, success: true });
  } catch (error) {
    res.json({ message: error.message });
  }
};
