import JsonWebToken from "jsonwebtoken";

import MongodbConfig from "../config/MongoDBConfig.js";
import * as CustomerManagement from "../Management/CustomerManagement.js"
import * as ManagerManagement from '../Management/ManagerManagement.js'
import *  as EmployeeManagement from '../Management/EmployeeManagement.js'
import * as Rest from "../utils/Rest.js"


export function ValidateForCustomer(req, res, next) {
    if(req.method === 'OPTIONS') {
        next()
    }
    let outToken = (req.body && req.body.access_token) || req.headers['access_token'] || (req.query && req.query.access_token);

    if (outToken){
        try {
            JsonWebToken.verify(outToken, MongodbConfig.authenticationkey, function(error, decoded) {
                if(error) {
                    return Rest.SendError(res, 9, 'Verify token failed', 400, error);
                }

                CustomerManagement.CheckCustomerAvailability(decoded.id, decoded.CusUserName, function(errorCode, errorMessage, httpCode, errorDescription, customer) {
                    if(errorCode) {
                        return Rest.SendError(res, errorCode, errorMessage, httpCode, errorDescription);
                    }

                    if(req.method === 'GET' || req.method === 'POST' || req.method === 'DELETE') {
                        req.query.accessCustomerId = decoded.id;
                        req.query.accessCusUserName = decoded.CusUserName;
                    }
                    else {
                        req.body.accessCustomerId = decoded.id;
                        req.body.accessCusUserName = decoded.CusUserName;
                    }
                    next();
                });
            });
        }
        catch (error) {
            return Rest.SendError(res, 9, 'Authenticate Failed', 400, error);
        }
    }
    else{
        return Rest.SendError(res, 9, 'Invalid Token', 400, "You need to log in to perform the request")
    }
}


export function ValidateForManager(req, res, next) {
    if(req.method === 'OPTIONS') {
        next()
    }
    let outToken = (req.body && req.body.access_token) || req.headers['access_token'] || (req.query && req.query.access_token);

    if (outToken){
        try {
            JsonWebToken.verify(outToken, MongodbConfig.authenticationkey, function(error, decoded) {
                if(error) {
                    return Rest.SendError(res, 9, 'Verify token failed', 400, error);
                }

                ManagerManagement.CheckManagerAvailability(decoded.id, decoded.MUserName, function(errorCode, errorMessage, httpCode, errorDescription, manager) {
                    if(errorCode) {
                        return Rest.SendError(res, errorCode, errorMessage, httpCode, errorDescription);
                    }

                    if(req.method === 'GET' || req.method === 'POST' || req.method === 'DELETE') {
                        req.query.accessManagerId = decoded.id;
                        req.query.accessMUserName = decoded.accessMUserName;
                    }
                    else {
                        req.body.accessManagerId = decoded.id;
                        req.body.accessMUserName = decoded.accessMUserName;
                    }
                    next();
                });
            });
        }
        catch (error) {
            return Rest.SendError(res, 9, 'Authenticate Failed', 400, error);
        }
    }
    else{
        return Rest.SendError(res, 9, 'Invalid Token', 400, "You need to log in to perform the request")
    }
}

export function ValidateForEmployee(req, res, next) {
    if(req.method === 'OPTIONS') {
        next()
    }
    let outToken = (req.body && req.body.access_token) || req.headers['access_token'] || (req.query && req.query.access_token);

    if (outToken){
        try {
            JsonWebToken.verify(outToken, MongodbConfig.authenticationkey, function(error, decoded) {
                if(error) {
                    return Rest.SendError(res, 9, 'Verify token failed', 400, error);
                }

                EmployeeManagement.CheckEmployeeAvailability(decoded.id, decoded.MUserName, function(errorCode, errorMessage, httpCode, errorDescription, manager) {
                    if(errorCode) {
                        return Rest.SendError(res, errorCode, errorMessage, httpCode, errorDescription);
                    }

                    if(req.method === 'GET' || req.method === 'POST' || req.method === 'DELETE') {
                        req.query.accessEmployeeId = decoded.id;
                        req.query.accessEUserName = decoded.accessEUserName;
                    }
                    else {
                        req.body.accessEmployeeId = decoded.id;
                        req.body.accessEUserName = decoded.accessEUserName;
                    }
                    next();
                });
            });
        }
        catch (error) {
            return Rest.SendError(res, 9, 'Authenticate Failed', 400, error);
        }
    }
    else{
        return Rest.SendError(res, 9, 'Invalid Token', 400, "You need to log in to perform the request")
    }
}