import Mongoose from "mongoose";

let Schema = Mongoose.Schema;

let OrderLineSchema = new Schema({
    OrderID:{
        type: String
    },
    ProductID:{
        type: String
    },
    Quantity: {
        type: Number
    },
    Cost: {
        type: Number
    }
})

export default Mongoose.model('OrderLine', OrderLineSchema);