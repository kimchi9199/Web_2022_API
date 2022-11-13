// basic process => return info
// f/b was build dependencies, use API to connect
import { createRequire } from "module";
import Product from "../models/Product.js";
import Cart from '../models/Cart.js'
import CartDetail from "../models/CartDetail.js";
import * as ProductManagement from '../Management/ProductManagement.js'
import * as Rest from  '../utils/Rest.js'


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

export async function AddProduct (req, res) {
    try{
        const newProduct = new Product(req.body);
        const ProductInsertData = await Product.insertMany(newProduct);
        if(!c){
            throw new Error("Can not add product");
        }else{
            return (
                res.json({
                    success: true,
                    message: "Created your account successfully",
                    product: ProductInsertData,
                })
            )
        }
    }catch(err){
        res.status(404).send();
    }
}

export async function AddProductToCart (req, res) {
    let AccessCustomerID = req.query.accessCustomerId;
    let CartOfCustomer = new Cart();
    let cartDetail = new  CartDetail();
    let ProductID = req.params.ProductID;
    Cart.find({
        CustomerID: AccessCustomerID
    })
        .then(cart => {
            CartOfCustomer = cart
        })
        .catch((err) => {
            return res.status(500).json ({
                success: false,
                message: 'cannot find your cart.',
                error: err.message
            })
        })

    cartDetail.CartID = CartOfCustomer._id;
    cartDetail.ProductID = ProductID;

    const CartDetailInsertData = await CartDetail.insertMany(cartDetail);
    if(CartDetailInsertData) {
        return (
            res.json({
                success: true,
                message: "Added to cart",
                CartDetail: CartDetailInsertData,
            })
        )
    }
    else {
        return (
            res.status(409).send({
                success: false,
                code: 7,
                message: "Something went wrong",
                description: "Cannot add this product to your cart"

            })
        )
    }
}


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

export function getProductByID(req, res)  {
    try{
        let id = req.params.ProductID;
        Product.findById(id)
            .then((product) => {
                return (
                    res.status(200).json({
                        success: true,
                        message: "Found one product",
                        product: product
                    })
                )
            })
            .catch((error) => {
                return res.status(500).json({
                    success: false,
                    message: "Not found",
                    error: error.message
                })
            })
    } catch (error) {
        res.status(404).send(error)
    }
}

export function DeleteProduct (req, res) {
    let productID = req.params.ProductID || '';
    let accessUserId = req.query.accessUserId || '';
    ProductManagement.Delete(accessUserId, productID, function (errorCode, errorMessage, httpCode, errorDescription) {
        if (errorCode) {
            return Rest.SendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        let ResultData = {};
        ResultData.id = UserID;
        return Rest.SendSuccess(res, ResultData, httpCode, "Deleted a product");
    });
}

export function UpdateProduct(req, res){

    let AccessUserId = req.body.accessUserId || '';


    let id = req.params.ProductID || '';
    let data = req.body || '';

    ProductManagement.Update(AccessUserId, id, data, function(errorCode, errorMessage, httpCode, errorDescription, result){
        if(errorCode){
            return Rest.SendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        let outResultData = {};
        outResultData.id = result._id;
        return Rest.SendSuccess(res, outResultData, httpCode, "Updated a product");
    });

}
