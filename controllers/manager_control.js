import mongoose from "mongoose";
import Employee from "../models/Employee.js";
import JsonWebToken from 'jsonwebtoken';
import * as Rest from '../utils/Rest.js';
import MongoConfig from '../config/MongoDBConfig.js';
import bcryptjs from 'bcryptjs'
import Validator from 'validator';
import Manager from "../models/Manager.js";
import * as ManagerManagement from '../Management/ManagerManagement.js'


export function getManager(req, res) {
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
            Manager.find()
                .then((allManager) => {
                    return res.status(200).json ({
                        success : true,
                        message : "A list of all Managers",
                        Employees : allManager,
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
    let MUserName = req.body.MUserName || '';
    let MPass = req.body.MPass || '';
    ManagerManagement.AuthenticateForManager(MUserName, MPass, function (ErrorCode, ErrorMess, httpCode, ErrorDescript, manager) {
        if (ErrorCode) {
            return Rest.SendError(res, ErrorCode, ErrorMess, httpCode, ErrorDescript);
        }

        JsonWebToken.sign({id: manager._id, MUserName: manager.MUserName}, MongoConfig.authenticationkey, {expiresIn: '10 days'}, function(error, token) {
            if(error) {
                return Rest.SendError(res, 1, 'Creating Token Failed', 400, error);
            }
            else{
                return Rest.SendSuccessToken(res, token, manager);
            }
        });
    });
}

export function GetManagerById(req, res){
    let accessManagerID = req.query.accessManagerId || '';
    const id = req.params.ManagerID;


    if(!Validator.isMongoId(id)) {
        return res.status(400).json({
            "success": false,
            "code": 8,
            "message": "Invalid manager id",
            "description": "The inputted manager id is in wrong format"
        })
    }

    if (accessManagerID != id) {
        return res.status(403).json({
            "success": false,
            "code": 9,
            "message": "Not available",
            "description": "This content is not available"
        })
    }

    Manager.findById(id)
        .then((manager) => {
            return res.status(200).json({
                success: true,
                message: `Found one employee with id: ${id}`,
                manager: manager,
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

export function DeleteManager (req, res) {
    let ManagerID = req.params.ManagerID || '';
    let accessManagerID = req.query.accessManagerId || '';

    ManagerManagement.Delete(accessManagerID, ManagerID, function (errorCode, errorMessage, httpCode, errorDescription) {
        if (errorCode) {
            return Rest.SendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        let ResultData = {};
        ResultData.id = ManagerID;
        return Rest.SendSuccess(res, ResultData, httpCode, "Deleted an manager");
    });
}

export function UpdateManager (req, res){

    let id = req.params.ManagerID || '';
    let accessManagerID = req.query.accessManagerId || '';
    let data = req.body || '';

    ManagerManagement.Update(accessManagerID, id, data, function(errorCode, errorMessage, httpCode, errorDescription, result){
        if(errorCode){
            return Rest.SendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        let outResultData = {};
        outResultData.id = result._id;
        return Rest.SendSuccess(res, outResultData, httpCode, "Updated a manager");
    });

}
