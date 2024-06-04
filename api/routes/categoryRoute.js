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
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  categoryRoute.updateCategory
);

export default router;
