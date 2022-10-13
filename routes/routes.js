// API include 2 components: first_function(controller-> logic process)
// second_routes http resquest to call first==> combine both => API
// routes for API

import express from "express"
import {Introduce} from "../controllers/clothesshopprocess.js";
import {ListProduct}  from "../controllers/product_process.js";

const router = express.Router();
router.get('/info', Introduce);
router.get('/products',ListProduct);

export default router;
/// import from customer_controller
import {CreateCustomer, getAllCustomer, Login} from '../controllers/customer_control.js'
router.post('/newCustomer', CreateCustomer);
router.get('/listCustomer', getAllCustomer);
router.post('/login', Login)

