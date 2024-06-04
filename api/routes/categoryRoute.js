import express from "express";

import categoryRoute from "../controllers/categoryController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  categoryRoute.createCategory
);

export default router;
