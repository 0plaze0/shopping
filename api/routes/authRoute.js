import express from "express";

import authController from "../controllers/authController.js";
import { requireSignIn, isAdmin } from "./../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/register").post(authController.registerController);
router.route("/login").post(authController.loginController);
//user-route
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//admin-route
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
router.post("/forgot-password", authController.forgotPasswordController);
router.put("/update-profile", requireSignIn, authController.updateProfile);
router.get("/orders", requireSignIn, authController.getOrder);
router.get("/order-status", requireSignIn, isAdmin, authController.getAllOrder);
router.put(
  "/change-status/:orderId",
  requireSignIn,
  isAdmin,
  authController.changeStatus
);

router.route("/test").get(requireSignIn, isAdmin, async (req, res) => {
  return res.send("hello");
});

export default router;
