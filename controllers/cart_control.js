import bcrypt from 'bcryptjs';
import Cart from '../models/Cart.js'
import Validator from 'validator';

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