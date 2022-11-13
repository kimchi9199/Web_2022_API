import bcrypt from 'bcryptjs';
import Cart from '../models/Cart.js'
import Validator from 'validator';
import CartDetail from "../models/CartDetail.js";

export const CreateCart = async(req, res) =>{

    try{
        const newCart = new Cart(req.body);
        const CartInsertData = await Cart.insertMany(newCart);
        if(!CartInsertData){
            throw new Error("Can not create cart");
        }else{
            return (
                res.json({
                    success: true,
                    message: "Created your cart successfully",
                    cart: CartInsertData,
                })
            )
        }
    }catch(err){
        res.status(404).send();
    }
}

export function GetCart (req, res) {
    Cart.find()
        .then((allCart) => {
            return res.status(200).json ({
                success : true,
                message : "List of all Carts",
                Carts : allCart,
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

export function GetCartByID (req, res) {
    try{
        let id = req.params.CartID;
        Cart.findById(id)
            .then((cart) => {
                return (
                    res.status(200).json({
                        success: true,
                        message: "Found one cart",
                        Cart: cart
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

export function GetCartByUserID (req, res) {
    try{
        let id = req.params.UserID
        Cart.find({CustomerID: id})
            .then((cart) => {
                return (
                    res.status(200).json({
                        success: true,
                        message: "Found",
                        Cart: cart
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

export function GetCartDetailByOrderID (req, res) {
    try{
        let id = req.params.CartID;
        CartDetail.find({CartID: id})
            .then((cartDetail) => {
                return (
                    res.status(200).json({
                        success: true,
                        message: "Found",
                        CartDetail: cartDetail
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