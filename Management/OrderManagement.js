import * as Utils from "../utils/utilFuncs.js";
import Validator from "validator";
import Order from "../models/Order.js";
import OrderLine from "../models/OrderLine.js";
import Employee from "../models/Employee.js";
import Manager from "../models/Manager.js";


export function Update(AccessEmployeeID, AccessManagerID, OrderID, UpdateData, callback) {
    try{

        let employee = Employee.find({_id: AccessEmployeeID})
        let manager = Manager.find({_id: AccessManagerID})

        if(employee || manager) {
            if(!Utils.VariableTypeChecker(OrderID, 'string') || !Validator.isMongoId(OrderID)) {
                return callback(8, 'invalid id', 400, 'Order id is not a string', null);
            }

            let query = {};
            query._id = CustomerID;
            let update = {};

            if(Utils.VariableTypeChecker(UpdateData.Status, 'string') &&
                Validator.isAlphhanumeric(UpdateData.Status)) {
                update.Status = UpdateData.Status;
            }

            let UpdateOptions = {
                upsert: false,
                new: true,
                setDefaultsOnInsert: true,
                projection: {password: false}
            };

            Order.findOneAndUpdate(query, update, options, function (error, order) {
                if (error) {
                    return callback(8, 'Find and Update failed', 420, error, null);
                }

                if (order) {
                    return callback(null, null, 200, null, order);
                }
                else{
                    return callback(8, 'Order is Unavailable', 400, null, null);
                }
            });
        }
        else {
            return callback(8, 'invalid_user_right', 403, "you don't have permission to perform this request", null);
        }
    }
    catch (error){
        return callback(8, 'Update failed', 400, error, null);
    }
}