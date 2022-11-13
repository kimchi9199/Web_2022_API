import Order from "../models/Order.js";
import OrderLine from  "../models/OrderLine.js"
import Cart from "../models/Cart.js";
import CartDetail from "../models/CartDetail.js";
import Product from "../models/Product.js";
import * as Rest from  '../utils/Rest.js'
import * as OrderManagement from '../Management/OrderManagement.js'


export async function CreteOrder (req, res) {
    try{
        const newOrder = new Order(req.body);
        let CustomerID = req.query.accessCustomerId || '';
        let CartID = '';
        newOrder.TotalCost = 0.0;

        newOrder.CustomerID = CustomerID;
        Cart.findOne({CustomerID: CustomerID}, function(error, cart) {
            if (error) {
                Rest.SendError(res, 7, "Something went wrong", 400, "Cannot find your Cart", error)
            }
            else if (cart) {
                CartID = cart._id;
                CartDetail.find({CartID: CartID}, function(error, cartDetail) {
                    if (error) {
                        Rest.SendError(res, 7, "Something went wrong", 400, "Cannot find your Cart", error)
                    }
                    else if (cartDetail) {
                        cartDetail.map(cartdetail => {
                            Product.findOne({_id: cartdetail.ProductID}, function(error, product) {
                                if (error) {
                                    Rest.SendError(res, 7, "Something went wrong", 400, "Cannot find your the product", error)
                                }
                                else if (product) {
                                    newOrder.TotalCost = newOrder.TotalCost + (cartdetail.Quantity * product.Price);
                                }
                            })
                        })
                    }
                })
            }
        })

        const OrderInsertData = await Order.insertMany(newOrder);
        if(!c){
            throw new Error("Can not create your order");
        }else{
            return (
                res.json({
                    success: true,
                    message: "Created your order successfully",
                    order: OrderInsertData,
                })
            )
        }
    }catch(err){
        res.status(404).send();
    }
}

export function GetAllOrder (req, res) {
    Order.find()
        .then((allOrder) => {
            return res.status(200).json ({
                success : true,
                message : "List of all Orders",
                Orders : allOrder,
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

export function GetOrderByID (req, res) {
    try{
        let id = req.params.OrderID;
        Order.findById(id)
            .then((order) => {
                return (
                    res.status(200).json({
                        success: true,
                        message: "Found one order",
                        Order: order
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

export function GetOrderByID (req, res) {
    try{
        let id = req.params.OrderID;
        Order.findById(id)
            .then((order) => {
                return (
                    res.status(200).json({
                        success: true,
                        message: "Found one order",
                        Order: order
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

export function GetOrderByCustomerID (req, res) {
    try{
        let id = req.params.CustomerID;
        Order.find({CustomerID: id})
            .then((order) => {
                return (
                    res.status(200).json({
                        success: true,
                        message: "Found one order",
                        Order: order
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

export function GetOrderLineByOrderID (req, res) {
    try{
        let id = req.params.OrderID;
        OrderLine.find({OrderID: id})
            .then((orderLine) => {
                return (
                    res.status(200).json({
                        success: true,
                        message: "Found",
                        OrderLine: orderLine
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

export function UpdateOrderStatus (req, res) {
    let AccessEmployeeID = req.body.accessEmployeeId || '';
    let AccessManagerID = req.body.accessManagerId || '';

    let id = req.params.OrderID || '';
    let data = req.body || '';

    OrderManagement.Update(AccessEmployeeID, AccessManagerID, id, data, function(errorCode, errorMessage, httpCode, errorDescription, result){
        if(errorCode){
            return Rest.SendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        let outResultData = {};
        outResultData.id = result._id;
        return Rest.SendSuccess(res, outResultData, httpCode, "Updated an order");
    });
}
