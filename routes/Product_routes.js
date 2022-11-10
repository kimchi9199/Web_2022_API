import express from "express";
import * as Product_controller from "../controllers/product_process.js";
// import {getAllProduct} from "../controllers/product_process.js";

const Product_router = express.Router();
Product_router.get('/v1/products', Product_controller.getAllProduct);
Product_router.get('/v1/products/:Material', Product_controller.getProductByMaterial);

export default Product_router;
