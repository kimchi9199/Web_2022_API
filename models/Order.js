import Mongoose from "mongoose";
import {Double} from "mongodb";

let Schema = Mongoose.Schema;

let OrderSchema = new Schema({
    CustomerID:{
        type: String
    },
    Status:{
        type: String,
        default: "Not Pay"
    },
    OrderDate:{
        type: Date,
        default: Date.now
    },
    FinishedDate: {
        type: Date
    },
    TotalCost: {
        type: Number
    }
})

export default Mongoose.model('Order', OrderSchema);