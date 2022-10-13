import mongoose from "mongoose";
import Customer from "../models/customer.js";
import bcrypt from 'bcryptjs';
import * as CustomerManagement from '../Management/CustomerManagement.js';
import JsonWebToken from 'jsonwebtoken';
import * as Rest from '../utils/Rest.js';
import MongoConfig from '../config/MongoDBConfig.js';

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

export function Login (req, res) {
    let LoginName = req.body.LoginName || '';
    let Password = req.body.Password || '';
    CustomerManagement.Authenticate(LoginName, Password, function (ErrorCode, ErrorMess, httpCode, ErrorDescript, customer) {
        if (ErrorCode) {
            return Rest.SendError(res, ErrorCode, ErrorMess, httpCode, ErrorDescript);
        }

        JsonWebToken.sign({id: customer._id, LoginName: customer.LoginName}, MongoConfig.authenticationkey, {expiresIn: '10 days'}, function(error, token) {
            if(error) {
                return Rest.SendError(res, 1, 'Creating Token Failed', 400, error);
            }
            else{
                return Rest.SendSuccessToken(res, token, customer);
            }
        });
    });
}