// import Validator from 'validator'
import * as Utils from '../utils/utilFuncs.js'
import Customer from '../models/customer.js'
import bcrypt  from "bcryptjs";
import Validator from 'validator';

export function Authenticate (CusUserName, CusPass, callback) {
    try {
        if(!Utils.VariableTypeChecker(CusUserName, 'string')){
            return callback(8, "invalid login name", 422, "Your login name is not a string", null);
        }

        if(!Utils.VariableTypeChecker(CusPass, 'string')){
            return callback(8, 'invalid password', 422, 'Your password is not a string', null);
        }

        Customer.findOne( {CusUserName: CusUserName}, function (error, customer) {
            if (error) {
                return callback(8, 'Not found', 420, error, null);
            }

            if(customer) {
                bcrypt.compare(CusPass, customer.CusPass, function (error, result) {
                    if (result === true) {
                        return callback(null, null, 200, null, customer);
                    }
                    else {
                        return callback(8, 'Wrong Password', 422, null, null);
                    }
                });
            }
            else
            {
                return callback(8, 'unavailable', 404, null, null);
            }
        });
    }
    catch (error) {
        return callback(8, 'authenticate failed', 400, error, null);
    }

}

export function CheckCustomerAvailability (accessCustomerId, accessLoginName, callback){
    try {
        if (!Utils.VariableTypeChecker(accessCustomerId, 'string')
            || !Validator.isMongoId(accessCustomerId)
            || !Utils.VariableTypeChecker(accessLoginName, 'string')) {
            return callback(8, 'invalid data', 400, 'Customer information is not a string', null)
        }

        Customer.findOne({CusUserName: accessLoginName, _id: accessCustomerId}, function(error, customer) {
            if(error) {
                return callback(8, 'Find Customer Failed', 420, error, null);
            }

            if(customer) {
                return callback(null, null, 200, null, customer);
            }
            else {
                return callback(8, 'Customer is Unavailable', 404, 'Not Found Any Customer', null);
            }
        });
    }
    catch (error) {
        return callback(8, 'Check Customer Availability Failed', 400, error, null);
    }
}

export function Delete(AccessCustomerId, CustomerID, callback) {
    try{
        if(AccessCustomerId !== CustomerID)
        {
            return callback(8, 'invalid_user_right', 403, "you don't have permission to perform this request", null);
        }

        if(!Utils.VariableTypeChecker(UserID, 'string') || !Validator.isMongoId(CustomerID)) {
            return callback(8, 'invalid_id', 400, 'The inputted customer id is in wrong format');
        }

        let query = {_id: CustomerID};
        Customer.findOne(query, function(error, customer) {
            if(error) {
                return callback(8, 'Cannot find the customer', 420, error);
            }
            else {
                if(customer) {
                    customer.remove(function(error) {
                        if(error) {
                            return callback(8, 'Remove failed', 420, error);
                        }
                        return callback(null, null, 200, null);
                    });
                } else {
                    return callback(null, null, 200, null);
                }
            }
        });
    } catch (error) {
        return callback(8, 'Delete failed', 400, error);
    }
}

export function Update(AccessCustomerId, CustomerID, UpdateData, callback) {
    try{
        if(AccessCustomerId !== CustomerID){
            return callback(8, 'invalid_user_right', 403, "you don't have permission to perform this request", null);
        }

        if(!Utils.VariableTypeChecker(UserID, 'string') || !Validator.isMongoId(CustomerID)) {
            return callback(8, 'invalid id', 400, 'Customer id is not a string', null);
        }

        let query = {};
        query._id = CustomerID;
        let update = {};

        if(Utils.VariableTypeChecker(UpdateData.CusName, 'string') &&
            Validator.isAlphhanumeric(UpdateData.CusName)) {
            update.CusName = UpdateData.CusName;
        }

        if(Utils.VariableTypeChecker(UpdateData.CusUserName, 'string')) {
            update.CusUserName = UpdateData.CusUserName;
        }


        if(Utils.VariableTypeChecker(UpdateData.CusEmail, 'string')) {
            update.CusEmail = UpdateData.CusEmail;
        }

        if(Utils.VariableTypeChecker(UpdateData.CusContact, 'string')) {
            update.CusContact = UpdateData.CusContact
        }

        if(Utils.VariableTypeChecker(UpdateData.CusAddress, 'string')) {
            update.CusAddress = UpdateData.CusAddress
        }

        if(Utils.VariableTypeChecker(UpdateData.CusBdate, 'string')) {
            update.CusBdate = UpdateData.CusBdate
        }


        let UpdateOptions = {
            upsert: false,
            new: true,
            setDefaultsOnInsert: true,
            projection: {password: false}
        };

        Customer.findOneAndUpdate(query, update, options, function (error, customer) {
            if (error) {
                return callback(8, 'Find and Update failed', 420, error, null);
            }

            if (customer) {
                return callback(null, null, 200, null, customer);
            }
            else{
                return callback(8, 'Customer is Unavailable', 400, null, null);
            }
        });
    }
    catch (error){
        return callback(8, 'Update failed', 400, error, null);
    }
}
