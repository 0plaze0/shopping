import express from "express";
import formidable from "express-formidable";
import productController from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/create-product")
  .post(requireSignIn, isAdmin, formidable(), productController.createProduct);
router.get("/get-products", productController.getProduct);
export default router;
