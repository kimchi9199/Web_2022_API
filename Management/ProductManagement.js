import * as Utils from '../utils/utilFuncs.js'
import Manager from '../models/Manager.js'
import Product from "../models/Product.js";
import bcrypt  from "bcryptjs";
import Validator from 'validator';

export function Delete(AccessUserId, ProductID, callback) {
    try{
        Manager.findOne({_id: AccessUserId}, function (error, manager) {
            if (error) {
                return callback(8, 'invalid_user_right', 403, "you don't have permission to perform this request", null);
            }
            else if (manager) {
                if(!Utils.VariableTypeChecker(ProductID, 'string') || !Validator.isMongoId(ProductID)) {
                    return callback(8, 'invalid_id', 400, 'The inputted product id is in wrong format');
                }
                let query = {_id: ProductID};
                Product.findOne(query, function(error, product) {
                    if(error) {
                        return callback(8, 'Cannot find the product', 420, error);
                    }
                    else {
                        if(product) {
                            product.remove(function(error) {
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

            }
        })
    } catch (error) {
        return callback(8, 'Delete failed', 400, error);
    }
}

export function Update(AccessUserID, ProductID, UpdateData, callback) {
    try{
        Manager.findOne({_id: AccessUserID}, function(error, manager) {
            if (error) {
                return callback(8, 'invalid_user_right', 403, "you don't have permission to perform this request", null);
            }
            else if (manager) {
                if(!Utils.VariableTypeChecker(ProductID, 'string') || !Validator.isMongoId(ProductID)) {
                    return callback(8, 'invalid id', 400, 'Product id is not a string', null);
                }
                let query = {};
                query._id = ProductID;
                let update = {};

                if(Utils.VariableTypeChecker(UpdateData.ProName, 'string')) {
                    update.ProName = UpdateData.ProName;
                }

                if(Utils.VariableTypeChecker(UpdateData.Material, 'string')) {
                    update.Material = UpdateData.Material;
                }

                // if(Utils.VariableTypeChecker(UpdateData.Price, 'string')) {
                //     update.Price = UpdateData.Price
                // }

                update.Price = UpdateData.Price
                update.Img_link = UpdateData.Img_link
                update.InStock = UpdateData.InStock

                let options = {
                    upsert: false,
                    new: true,
                    setDefaultsOnInsert: true,
                    projection: {password: false}
                };

                Product.findOneAndUpdate(query, update, options, function (error, product) {
                    if (error) {
                        return callback(8, 'Find and Update failed', 420, error, null);
                    }

                    if (product) {
                        return callback(null, null, 200, null, product);
                    }
                    else{
                        return callback(8, 'Product is Unavailable', 400, null, null);
                    }
                });
            }
        })






    }
    catch (error){
        return callback(8, 'Update failed', 400, error, null);
    }
}
