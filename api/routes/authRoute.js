import express from "express";

import authController from "../controllers/authController.js";
import { requireSignIn, isAdmin } from "./../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/register").post(authController.registerController);
router.route("/login").post(authController.loginController);
router.route("/test").get(requireSignIn, isAdmin, async (req, res) => {
  return res.send("hello");
});

export default router;
