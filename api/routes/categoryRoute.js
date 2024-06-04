import express from "express";

import categoryRoute from "../controllers/categoryController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

//create category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  categoryRoute.createCategory
);
//update
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  categoryRoute.updateCategory
);

//get category
router.get(
  "/single-category/:slug",

  categoryRoute.getCategory
);
//get All category
router.get(
  "/get-category",

  categoryRoute.getAllCategory
);

//delet category
router.get(
  "/delete-category/:id",

  categoryRoute.deleteCategory
);

export default router;
