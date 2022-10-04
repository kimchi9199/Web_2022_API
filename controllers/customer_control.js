import mongoose from "mongoose";
import Customer from "../models/customer.js";
import e from "express";

export const CreateCustomer = async (req, res) => {
   const newCustomer = new Customer(req.body) // create new object from info from body we sent
    return newCustomer
        .save()
        .then((newCus) => {
            return res.status(201).json({
                success : true,
                message : 'New Customer added',
                Customer : newCus,
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                success : false,
                message : "Save fail",
                error: error.message,
            });
        });
}

export  function getAllCustomer(req, res) {
    Customer.find()
        // .select('CusName CusUserName')
        .then((allCustomer) => {
            return res.status(200).json ({
                success : true,
                message : "A list of all Customer",
                Customer : allCustomer,
            });
        })
        .catch((err) => {
            res.status(500).json({
                success : false,
                message : 'Server error. Please try again.',
                error : err.message,
            });
    });
}