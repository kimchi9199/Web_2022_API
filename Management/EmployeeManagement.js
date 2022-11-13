import * as Utils from '../utils/utilFuncs.js'
import bcrypt  from "bcryptjs";
import Validator from 'validator';
import Manager from "../models/Manager.js";
import Employee from "../models/Employee.js";



export function Authenticate (EUserName, EPass, callback) {
    try {
        if(!Utils.VariableTypeChecker(EUserName, 'string')){
            return callback(8, "invalid login name", 422, "Your login name is not a string", null);
        }

        if(!Utils.VariableTypeChecker(EPass, 'string')){
            return callback(8, 'invalid password', 422, 'Your password is not a string', null);
        }

        User.findOne( {EUserName: EUserName}, function (error, employee) {
            if (error) {
                return callback(8, 'Not found', 420, error, null);
            }

            if(employee) {
                bcrypt.compare(EPass, employee.EPass, function (error, result) {
                    if (result === true) {
                        return callback(null, null, 200, null, employee);
                    }
                    else {
                        return callback(8, 'Wrong Password', 422, "Pass word is not match with this account", null);
                    }
                });
            }
            else
            {
                return callback(8, 'unavailable', 404, "Cannot find your account", null);
            }
        });
    }
    catch (error) {
        return callback(8, 'authenticate failed', 400, error, null);
    }

}

export function CheckEmployeeAvailability (accessEmployeeID, accessEmployeeUserName, callback){
    try {
        if (!Utils.VariableTypeChecker(accessEmployeeID, 'string')
            || !Validator.isMongoId(accessEmployeeID)
            || !Utils.VariableTypeChecker(accessEmployeeUserName, 'string')) {
            return callback(8, 'invalid data', 400, 'Employee information is not a string', null)
        }

        Manager.findOne({EUserName: accessEmployeeUserName, _id: accessEmployeeID}, function(error, employee) {
            if(error) {
                return callback(8, 'Find Manager Failed', 420, error, null);
            }

            if(employee) {
                return callback(null, null, 200, null, employee);
            }
            else {
                return callback(8, 'Employee is Unavailable', 404, 'Not Found Any Employee', null);
            }
        });
    }
    catch (error) {
        return callback(8, 'Check Employee Availability Failed', 400, error, null);
    }
}

export function Delete(AccessEmployeeId, AccessManagerID, EmployeeID, callback) {
    try{
        Manager.findOne({_id: AccessManagerID}, function(error, manager) {
            if (error) {
                return callback(8, 'invalid_user_right', 403, "you don't have permission to perform this request", null);
            }
        })

        if(AccessEmployeeId !== EmployeeID)
        {
            return callback(8, 'invalid_user_right', 403, "you don't have permission to perform this request", null);
        }

        if(!Utils.VariableTypeChecker(EmployeeID, 'string') || !Validator.isMongoId(EmployeeID)) {
            return callback(8, 'invalid_id', 400, 'The inputted employee id is in wrong format');
        }

        let query = {_id: EmployeeID};
        Employee.findOne(query, function(error, employee) {
            if(error) {
                return callback(8, 'Cannot find the employee', 420, error);
            }
            else {
                if(employee) {
                    employee.remove(function(error) {
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

export function Update(AccessEmployeeId, AccessManagerID, EmployeeID, UpdateData, callback) {
    try{

        Manager.findOne({_id: AccessManagerID}, function(error, manager) {
            if (error) {
                return callback(8, 'invalid_user_right', 403, "you don't have permission to perform this request", null);
            }
        })
        if(AccessEmployeeId !== EmployeeID){
            return callback(8, 'invalid_user_right', 403, "you don't have permission to perform this request", null);
        }

        if(!Utils.VariableTypeChecker(EmployeeID, 'string') || !Validator.isMongoId(EmployeeID)) {
            return callback(8, 'invalid id', 400, 'User id is not a string', null);
        }

        let query = {};
        query._id = EmployeeID;
        let update = {};

        if(Utils.VariableTypeChecker(UpdateData.EName, 'string') &&
            Validator.isAlphhanumeric(UpdateData.EName)) {
            update.EName = UpdateData.EName;
        }

        if(Utils.VariableTypeChecker(UpdateData.EUserName, 'string')) {
            update.EUserName = UpdateData.EUserName;
        }

        if(Utils.VariableTypeChecker(UpdateData.EEmail, 'string')) {
            update.EEmail = UpdateData.EEmail
        }

        if(Utils.VariableTypeChecker(UpdateData.EContact, 'string')) {
            update.EContact = UpdateData.EContact
        }

        if(Utils.VariableTypeChecker(UpdateData.EAddress, 'string')) {
            update.EAddress = UpdateData.EAddress
        }

        if(Utils.VariableTypeChecker(UpdateData.EBdate, 'string')) {
            update.EBdate = UpdateData.EBdate
        }

        let options = {
            upsert: false,
            new: true,
            setDefaultsOnInsert: true,
            projection: {password: false}
        };

        Employee.findOneAndUpdate(query, update, options, function (error, employee) {
            if (error) {
                return callback(8, 'Find and Update failed', 420, error, null);
            }

            if (employee) {
                return callback(null, null, 200, null, employee);
            }
            else{
                return callback(8, 'User is Unavailable', 400, null, null);
            }
        });
    }
    catch (error){
        return callback(8, 'Update failed', 400, error, null);
    }
}
