import JsonWebToken from "jsonwebtoken";

import MongodbConfig from "../config/MongoDBConfig.js";
import * as CustomerManagement from "../Management/CustomerManagement.js"
import * as Rest from "../utils/Rest.js"
import {CheckCustomerAvailability} from "../Management/CustomerManagement.js";

export function Validate(req, res, next) {
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
                        req.query.accessCustomerId = decoded.id;
                        req.query.accessCusUserName = decoded.CusUserName;
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