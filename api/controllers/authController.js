import userModel from "../models/userModel.js";
import { hashPassword } from "./../utils/authUtils.js";

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

export default { registerController };
