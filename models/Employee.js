import Mongoose from "mongoose";
// const Mongoose  = require ('mongoose'); = line 1 to import mongoose

let Schema = Mongoose.Schema;

let EmployeeSchema = new Schema({

    EName:{
        type: String,
        minlength: 4,
        maxlength: 64,
        default: 'NONE'
    },
    EUserName:{
        type: String,
        minlength: 4,
        maxlength: 64,
        default: 'NONE'
    },
    EPass:{
        type: String,
        minlength: 4,
        maxlength: 64,
        required: true
    },
    EEmail:{
        type: String,
        unique: true,
        required: true
    },
    EContact:{
        type: String,
        unique: true,
        required: false
    },
    EAddress:{
        type: String,
        required: true
    },
    EBdate:{
        type: Date,
        required: true
    },
    JobTitle:{
        type: String
    }
})
// Chua co reference
// associatedWith

export default Mongoose.model('Employee', EmployeeSchema);