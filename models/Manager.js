import Mongoose from "mongoose";
// const Mongoose  = require ('mongoose'); = line 1 to import mongoose

let Schema = Mongoose.Schema;

let ManagerSchema = new Schema({

    MName:{
        type: String,
        minlength: 4,
        maxlength: 64,
        default: 'NONE'
    },
    MUserName:{
        type: String,
        minlength: 4,
        maxlength: 64,
        default: 'NONE'
    },
    MPass:{
        type: String,
        minlength: 4,
        maxlength: 64,
        required: true
    },
    MEmail:{
        type: String,
        unique: true,
        required: true
    },
    MContact:{
        type: String,
        unique: true,
        required: false
    },
    MAddress:{
        type: String,
        required: true
    },
    MBdate:{
        type: Date,
        required: true
    }
})


export default Mongoose.model('Manager', ManagerSchema);