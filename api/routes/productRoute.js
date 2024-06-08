import express from "express";
import formidable from "express-formidable";
import productController from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/create-product")
  .post(requireSignIn, isAdmin, formidable(), productController.createProduct);
router
  .route("/update-product/:pid")
  .put(requireSignIn, isAdmin, formidable(), productController.updateProduct);
router.get("/get-products", productController.getAllProduct);
router.get("/get-products/:slug", productController.getProduct);
router.get("/product-photo/:pid", productController.productPhoto);
router.delete("/delete-product/:pid", productController.deleteProduct);
export default router;
