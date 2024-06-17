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
router.post("/filter-product", productController.filterProduct);
router.get("/product-count", productController.productCount);
router.post("/product-list/:page", productController.productList);
router.post("/search/:keyword", productController.searchProduct);
router.get("/related-product/:pid/:category", productController.relatedProduct);
router.get("/product-category/:slug", productController.productCategory);
export default router;
