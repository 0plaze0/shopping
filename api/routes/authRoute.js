import express from "express";

import authController from "../controllers/authController.js";

const router = express.Router();

router.route("/register").post(authController.registerController);
router.route("/login").post(authController.loginController);

export default router;
