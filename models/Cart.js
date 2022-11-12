import Mongoose from "mongoose";

let Schema = Mongoose.Schema;

let CartSchema = new Schema({
    CreatedDate:{
        type: Date
    }
})

export default Mongoose.model('Cart', CartSchema);