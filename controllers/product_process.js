// basic process => return info
// f/b was build dependencies, use API to connect
import { createRequire } from "module";
import Product from "../models/Product.js";

const require = createRequire(import.meta.url);
// back previous a folder
const proinfo = require("../data/product_info.json") ;

//export to export function for others to use
// get all product
// export const ListProduct = async (req,res) => {
//     try
//     {
//         res.send(proinfo);
//     }
//     catch (error)
//     {
//         console.log(error);
//     }
// }

export function getAllProduct(req, res) {
    Product.find()
        .then((allProduct) => {
            return res.status(200).json ({
                success : true,
                message : "List of all Product",
                Product : allProduct,
            });
        })
        .catch((err) => {
            res.status(500).json ({
                success : false,
                message : 'Server error. Please try again.',
                error : err.message,
            });
    });
}

export function getProductByMaterial(req, res)  {
    try{
        let material = req.params.Material;
         Product.find({
             Material: material
         }).then((product) => {
             return (
                 res.status(200).json({
                 success: true,
                 message: `Our ${material} products`,
                 product: product
                })
             )
         }).catch((error) => {
             res.status(500).json({
                 success: false,
                 message: "Not found",
                 error: error.message
             })
         })
    } catch (error) {
        res.status(404).send(error)
    }
}

