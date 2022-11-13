import Mongoose from "mongoose";

let Schema = Mongoose.Schema;

let CartDetailSchema = new Schema({
    CartID:{
        type: String
    },
    ProductID:{
        type: String
    },
    Quantity: {
        type: Number,
        default: 1
    }
})

export default Mongoose.model('CartDetail', CartDetailSchema);