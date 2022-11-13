import mongoose from "mongoose";
import Customer from "../models/customer.js";
import Cart from '../models/Cart.js'
import * as CustomerManagement from '../Management/CustomerManagement.js';
import JsonWebToken from 'jsonwebtoken';
import * as Rest from '../utils/Rest.js';
import MongoConfig from '../config/MongoDBConfig.js';
import bcryptjs from 'bcryptjs'
import Validator from 'validator';


export const CreateCustomer = async (req, res) => {
   const newCustomer = new Customer(req.body) // create new object from info from body we sent
    let encryptedPass = await bcryptjs.hash(req.body.CusPass, 10);
   newCustomer.CusPass = encryptedPass;
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
            return res.status(500).json({
                success : false,
                code: 8,
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
                code: 8,
                message : 'Server error. Please try again.',
                error : err.message,
            });
    });
}

export function Login (req, res) {
    let CusUserName = req.body.CusUserName || '';
    let CusPass = req.body.CusPass || '';
    CustomerManagement.Authenticate(CusUserName, CusPass, function (ErrorCode, ErrorMess, httpCode, ErrorDescript, customer) {
        if (ErrorCode) {
            return Rest.SendError(res, ErrorCode, ErrorMess, httpCode, ErrorDescript);
        }

        JsonWebToken.sign({id: customer._id, CusUserName: customer.CusUserName}, MongoConfig.authenticationkey, {expiresIn: '10 days'}, function(error, token) {
            if(error) {
                return Rest.SendError(res, 1, 'Creating Token Failed', 400, error);
            }
            else{
                return Rest.SendSuccessToken(res, token, customer);
            }
        });
    });
}

export function GetCustomerById(req, res){
    let accessCustomerId = req.query.accessCustomerId || '';
    const id = req.params.CustomerID;

    if(!Validator.isMongoId(id)) {
        return res.status(400).json({
            "success": false,
            "code": 8,
            "message": "Invalid user id",
            "description": "The inputted user id is in wrong format"
        })
    }

    if (accessCustomerId != id) {
        return res.status(403).json({
            "success": false,
            "code": 9,
            "message": "Not available",
            "description": "This content is not available"
        })
    }
    Customer.findById(id)
        .then((customer) => {
            return res.status(200).json({
                success: true,
                message: `Found one user with id: ${id}`,
                customer: customer,
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                code: 8,
                message: 'Not Found.',
                description: err.message,
            });
        });
}

export function DeleteCustomer (req, res) {
    let CustomerID = req.params.CustomerID || '';
    let accessCustomerId = req.query.accessCustomerId || '';
    CustomerManagement.Delete(accessCustomerId, CustomerID, function (errorCode, errorMessage, httpCode, errorDescription) {
        if (errorCode) {
            return Rest.SendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        let ResultData = {};
        ResultData.id = UserID;
        return Rest.SendSuccess(res, ResultData, httpCode, "Deleted a customer");
    });
}

export function UpdateCustomer (req, res){

    let AccessCustomerId = req.body.accessCustomerId || '';
    let id = req.params.CustomerID || '';
    let data = req.body || '';

    CustomerManagement.Update(AccessCustomerId, id, data, function(errorCode, errorMessage, httpCode, errorDescription, result){
        if(errorCode){
            return Rest.SendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        let outResultData = {};
        outResultData.id = result._id;
        return Rest.SendSuccess(res, outResultData, httpCode, "Updated a customer");
    });

}
