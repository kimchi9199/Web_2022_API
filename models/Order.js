import Mongoose from "mongoose";
import {Double} from "mongodb";

let Schema = Mongoose.Schema;

let OrderSchema = new Schema({
    CustomerID:{
        type: String
    },
    Status:{
        type: String
    },
    OrderDate:{
        type: Date,
        default: Date.now
    },
    FinishedDate: {
        type: Date
    },
    TotalCost: {
        type: Double
    }
})

export default Mongoose.model('Order', OrderSchema);