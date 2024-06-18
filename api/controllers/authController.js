import jwt from "jsonwebtoken";

import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "./../utils/authUtils.js";

const registerController = async (req, res) => {
  const requiredField = [
    "name",
    "email",
    "password",
    "phone",
    "address",
    "answer",
  ];
  try {
    const { name, email, password, phone, address, answer } = req.body;
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
      answer,
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
        role: user.role,
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

const forgotPasswordController = async (req, res) => {
  const requiredField = ["email", "newPassword", "answer"];
  const { newPassword, email, answer } = req.body;
  try {
    for (const field of requiredField) {
      if (!req.body[field])
        return res.status(400).send({ error: `${field} is required` });
    }

    const user = await userModel.findOne({ email, answer });

    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "Wrong Email or Answer" });
    const hashed = await hashPassword(newPassword);

    const setPassword = await userModel.findByIdAndUpdate(user._id, {
      password: hashed,
    });

    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while setting forgot password",
      err,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, password, email, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);

    if (password && password.length < 5)
      return res.status(400).send({
        success: false,
        message: "Password length should be greater then 6",
      });

    const hashPwd = password ? await hashPassword(password) : undefined;

    const updateUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        address: address || user.address,
        phone: phone || user.phone,
        password: hashPwd || user.password,
      },
      {
        new: true,
      }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated successfully",
      updateUser,
    });
  } catch (error) {
    console.log(error);
  }
};

export default {
  updateProfile,
  registerController,
  loginController,
  forgotPasswordController,
};
