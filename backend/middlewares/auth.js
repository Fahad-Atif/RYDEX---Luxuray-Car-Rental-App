
import jwt from "jsonwebtoken"
import User from "../models/User.js"


export const userAuthorization = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.json({
      message: "Please Login or Register First!",
    });
  }

  try {
    const userId = jwt.decode(token, process.env.JWT_SECRET);

    if (!userId) {
      return res.json({
        message: "Unauthorize Access",
      });
    }

    const getUser = await User.findOne({_id:userId}).select("-password");

    if (!getUser) {
      return res.json({
        message: "User not found",
      });
    }

    req.user = getUser;
    next();

    

  } catch (error) {
    res.json({
      message: error.message,
      
    });
  }
};
