// import Validator from 'validator'
import * as Utils from '../utils/utilFuncs.js'
import Manager from '../models/Manager.js'
import bcrypt  from "bcryptjs";
import Validator from 'validator';

export function AuthenticateForManager (MUserName, MPass, callback) {
    try {
        if(!Utils.VariableTypeChecker(MUserName, 'string')){
            return callback(8, "invalid login name", 422, "Your login name is not a string", null);
        }

        if(!Utils.VariableTypeChecker(MPass, 'string')){
            return callback(8, 'invalid password', 422, 'Your password is not a string', null);
        }

        Manager.findOne( {MUserName: MUserName}, function (error, manager) {
            if (error) {
                return callback(8, 'Not found', 420, error, null);
            }

            if(manager) {
                bcrypt.compare(MPass, manager.MPass, function (error, result) {
                    if (result === true) {
                        return callback(null, null, 200, null, manager);
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

export function CheckManagerAvailability (accessManagerID, accessUserName, callback){
    try {
        if (!Utils.VariableTypeChecker(accessManagerID, 'string')
            || !Validator.isMongoId(accessManagerID)
            || !Utils.VariableTypeChecker(accessUserName, 'string')) {
            return callback(8, 'invalid data', 400, 'Manager information is not a string', null)
        }

        Manager.findOne({MUserName: accessUserName, _id: accessManagerID}, function(error, manager) {
            if(error) {
                return callback(8, 'Find Manager Failed', 420, error, null);
            }

            if(manager) {
                return callback(null, null, 200, null, manager);
            }
            else {
                return callback(8, 'Manager is Unavailable', 404, 'Not Found Any Manager', null);
            }
        });
    }
    catch (error) {
        return callback(8, 'Check Manager Availability Failed', 400, error, null);
    }
}

export function Delete(AccessManagerID, ManagerID, callback) {
    try{
        if(AccessManagerID !== ManagerID)
        {
            return callback(8, 'invalid_user_right', 403, "you don't have permission to perform this request", null);
        }

        if(!Utils.VariableTypeChecker(ManagerID, 'string') || !Validator.isMongoId(ManagerID)) {
            return callback(8, 'invalid_id', 400, 'The inputted manager id is in wrong format');
        }

        let query = {_id: ManagerID};
        Manager.findOne(query, function(error, manager) {
            if(error) {
                return callback(8, 'Cannot find the manager', 420, error);
            }
            else {
                if(manager) {
                    manager.remove(function(error) {
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

export function Update(AccessManagerID, ManagerID, UpdateData, callback) {
    try{
        if(AccessManagerID !== ManagerID){
            return callback(8, 'invalid_user_right', 403, "you don't have permission to perform this request", null);
        }

        if(!Utils.VariableTypeChecker(ManagerID, 'string') || !Validator.isMongoId(ManagerID)) {
            return callback(8, 'invalid id', 400, 'Manager id is not a string', null);
        }

        let query = {};
        query._id = ManagerID;
        let update = {};

        if(Utils.VariableTypeChecker(UpdateData.MName, 'string') &&
            Validator.isAlphhanumeric(UpdateData.MName)) {
            update.MName = UpdateData.MName;
        }

        if(Utils.VariableTypeChecker(UpdateData.MUserName, 'string')) {
            update.MUserName = UpdateData.MUserName;
        }


        if(Utils.VariableTypeChecker(UpdateData.MEmail, 'string')) {
            update.MEmail = UpdateData.MEmail;
        }

        if(Utils.VariableTypeChecker(UpdateData.MContact, 'string')) {
            update.MContact = UpdateData.MContact
        }

        if(Utils.VariableTypeChecker(UpdateData.MAddress, 'string')) {
            update.MAddress = UpdateData.MAddress
        }

        if(Utils.VariableTypeChecker(UpdateData.MBdate, 'string')) {
            update.MBdate = UpdateData.MBdate
        }


        let UpdateOptions = {
            upsert: false,
            new: true,
            setDefaultsOnInsert: true,
            projection: {password: false}
        };

        Manager.findOneAndUpdate(query, update, options, function (error, manager) {
            if (error) {
                return callback(8, 'Find and Update failed', 420, error, null);
            }

            if (manager) {
                return callback(null, null, 200, null, manager);
            }
            else{
                return callback(8, 'Manager is Unavailable', 400, null, null);
            }
        });
    }
    catch (error){
        return callback(8, 'Update failed', 400, error, null);
    }
}
