import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const decode = await jwt.verify(
      req.headers.authorization,
      process.env.ACCESS_TOKEN
    );
    console.log(decode);
    req.user = decode;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      err,
      message: "Error in token validation middleware",
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res
        .status(401)
        .send({ success: false, message: "Unauthorized Access" });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, err, message: "Error in Admin middleware" });
  }
};
