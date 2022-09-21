// API include 2 components: first_function(controller-> logic process)
// second_routes http resquest to call first==> combine both => API
// routes for API

import express from "express"
import {Introduce} from "../controllers/clothesshopprocess.js";

const router = express.Router();
router.get('/info', Introduce);

export default router;
