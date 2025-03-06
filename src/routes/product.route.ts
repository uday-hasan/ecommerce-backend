import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByVendor,
  updateProduct,
} from "../controller/product.controller";
import {
  isAuthenticated,
  vendorAccessOnly,
  vendorAdminAccess,
} from "../middleware/authentication";

const productRouter = Router();

/**
 * @desc Get all products
 * @route GET /api/v1/products
 * @access public
 */
productRouter.get("/", getAllProducts);

/**
 * @desc Get products as vendor
 * @route GET /api/v1/products/vendor
 * @access Vendor
 */
productRouter.get(
  "/vendor",
  isAuthenticated,
  vendorAccessOnly,
  getProductsByVendor
);

/**
 * @desc Get single product
 * @route GET /api/v1/products/:id
 * @access public
 */
productRouter.get("/:id", getProductById);

/**
 * @desc Add product
 * @route POST /api/v1/products
 * @access only vendor
 */
productRouter.post("/", isAuthenticated, vendorAccessOnly, addProduct);

/**
 * @desc Update product
 * @route GET /api/v1/products/:id
 * @access only vendor
 */
productRouter.put("/:id", isAuthenticated, vendorAccessOnly, updateProduct);

/**
 * @desc Delete products
 * @route GET /api/v1/products/:id
 * @access admin and vendor
 */
productRouter.delete("/:id", isAuthenticated, vendorAdminAccess, deleteProduct);

export default productRouter;
