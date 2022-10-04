import Mongoose from "mongoose";
// const Mongoose  = require ('mongoose'); = line 1 to import mongoose

let Schema = Mongoose.Schema;

let CustomerSchema = new Schema({

    CusName:{
        type: String,
        minlength: 4,
        maxlength: 64,
        default: 'NONE'
    },
    CusUserName:{
        type: String,
        minlength: 4,
        maxlength: 64,
        default: 'NONE'
    },
    CusPass:{
        field: "CusPass",
        type: String,
        minlength: 4,
        maxlength: 64,
        required: true
    },
    CusEmail:{
        field: "CusEmail",
        type: String,
        unique: true,
        required: true
    },
    CusContact:{
        type: String,
        unique: true,
        required: false
    },
    CusAddress:{
        type: String,
        required: true
    },
    CusBdate:{
        type: Date,
        required: true
    },
    CusPoint:{
        type: Number
    },
    CreatedDate:{
        type: Date
    }
})
// Chua co reference
// associatedWith

export default Mongoose.model('Customer', CustomerSchema);