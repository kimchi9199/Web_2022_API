import mongoose from "mongoose";
import Employee from "../models/Employee.js";
import Cart from '../models/Cart.js'
import JsonWebToken from 'jsonwebtoken';
import * as Rest from '../utils/Rest.js';
import MongoConfig from '../config/MongoDBConfig.js';
import bcryptjs from 'bcryptjs'
import Validator from 'validator';
import Manager from "../models/Manager.js";
import * as EmployeeManagement from '../Management/EmployeeManagement.js'

export const CreateEmployee = async (req, res) => {
    let accessManagerID = req.query.accessManagerId
    Manager.findOne({_id: accessManagerID}, function(error, manager) {
        if (error) {
            return res.status(500).json({
                success : false,
                code: 8,
                message : "Save fail",
                error: "Only manager can add employee",
            });
        }
        else if (manager) {
            const newEmployee = new Employee(req.body) // create new object from info from body we sent
            let encryptedPass =  bcryptjs.hash(req.body.CusPass, 10);
            newEmployee.EPass = encryptedPass;
            return newEmployee
                .save()
                .then((newEmp) => {
                    return res.status(201).json({
                        success : true,
                        message : 'New employee added',
                        Employee : newEmp,
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
    });

}

export function getEmployee(req, res) {
    let accessManagerID = req.query.accessManagerId
    Manager.findOne({_id: accessManagerID}, function(error, manager) {
        if (error) {
            return res.status(500).json({
                success : false,
                code: 8,
                message : "Permission error",
                error: "You do not have permission to perform this request",
            });
        }
        else if (manager) {
            Employee.find()
                .then((allEmployee) => {
                    return res.status(200).json ({
                        success : true,
                        message : "A list of all Employees",
                        Employees : allEmployee,
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
    })
}

export function Login (req, res) {
    let EUserName = req.body.EUserName || '';
    let EPass = req.body.EPass || '';
    EmployeeManagement.Authenticate(EUserName, EPass, function (ErrorCode, ErrorMess, httpCode, ErrorDescript, employee) {
        if (ErrorCode) {
            return Rest.SendError(res, ErrorCode, ErrorMess, httpCode, ErrorDescript);
        }

        JsonWebToken.sign({id: employee._id, EUserName: employee.EUserName}, MongoConfig.authenticationkey, {expiresIn: '10 days'}, function(error, token) {
            if(error) {
                return Rest.SendError(res, 1, 'Creating Token Failed', 400, error);
            }
            else{
                return Rest.SendSuccessToken(res, token, employee);
            }
        });
    });
}

export function GetEmployeeById(req, res){
    let accessEmployeeID = req.query.accessEmployeeId || '';
    let accessManagerID = req.query.accessManagerId || '';
    const id = req.params.EmployeeID;


    if(!Validator.isMongoId(id)) {
        return res.status(400).json({
            "success": false,
            "code": 8,
            "message": "Invalid employee id",
            "description": "The inputted employee id is in wrong format"
        })
    }

    if (accessEmployeeID != id) {
        Manager.findOne({_id: accessManagerID}, function(error, manager) {
            if(error) {
                return res.status(403).json({
                    "success": false,
                    "code": 9,
                    "message": "Not available",
                    "description": "This content is not available"
                })
            }
        })
    }

    Employee.findById(id)
        .then((employee) => {
            return res.status(200).json({
                success: true,
                message: `Found one employee with id: ${id}`,
                employee: employee,
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

export function DeleteEmployee (req, res) {
    let EmployeeID = req.params.EmployeeID || '';
    let accessEmployeeID = req.query.accessEmployeeId || '';
    let accessManagerID = req.query.accessManagerId || '';

    EmployeeManagement.Delete(accessEmployeeID, accessManagerID, EmployeeID, function (errorCode, errorMessage, httpCode, errorDescription) {
        if (errorCode) {
            return Rest.SendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        let ResultData = {};
        ResultData.id = EmployeeID;
        return Rest.SendSuccess(res, ResultData, httpCode, "Deleted an employee");
    });
}

export function UpdateEmployee (req, res){

    let id = req.params.EmployeeID || '';
    let accessEmployeeID = req.query.accessEmployeeId || '';
    let accessManagerID = req.query.accessManagerId || '';
    let data = req.body || '';

    EmployeeManagement.Update(accessEmployeeID, accessManagerID, id, data, function(errorCode, errorMessage, httpCode, errorDescription, result){
        if(errorCode){
            return Rest.SendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        let outResultData = {};
        outResultData.id = result._id;
        return Rest.SendSuccess(res, outResultData, httpCode, "Updated an employee");
    });

}
