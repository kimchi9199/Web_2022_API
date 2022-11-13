import Mongoose from "mongoose";

let Schema = Mongoose.Schema;

let CartSchema = new Schema({
    CustomerID: {
        type: String
    },
    CreatedDate:{
        type: Date,
        default: Date.now
    }
})

export default Mongoose.model('Cart', CartSchema);