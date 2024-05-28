import jwt from "jsonwebtoken";

import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "./../utils/authUtils.js";

const requiredField = ["name", "email", "password", "phone", "address"];
const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    //validation
    for (const field of requiredField) {
      if (!req.body[field])
        return res.status(400).send({ error: `${field} is required` });
    }
    //check user
    const existingUser = await userModel.findOne({ email });

    //existing user
    if (existingUser)
      return res.status(200).send({
        success: true,
        message: "Already registered with the email. Please login",
      });
    //save
    const hashedPassword = await hashPassword(password);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });
    res.status(201).send({
      success: true,
      message: "User register Successfully!",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in registeration",
      err,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .send({ success: false, message: "Invalid email or password" });

    const user = await userModel.findOne({ email });

    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "Email is not registered" });
    const match = await comparePassword(password, user.password);
    if (!match)
      return res
        .status(401)
        .send({ success: false, message: "Invalid Password" });

    const token = await jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: "7d",
    });

    return res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in login",
      err,
    });
  }
};

export default { registerController, loginController };
