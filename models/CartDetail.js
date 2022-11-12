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
        type: Number
    }
})

export default Mongoose.model('CartDetail', CartDetailSchema);