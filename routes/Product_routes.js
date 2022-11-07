import express from "express";
import * as Product_controler from "../controllers/product_process.js";
// import {getAllProduct} from "../controllers/product_process.js";

const Product_router = express.Router();
Product_router.get('/ListAllProduct', Product_controler.getAllProduct);

export default Product_router;
