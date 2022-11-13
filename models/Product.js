import Mongoose from "mongoose";

let Schema = Mongoose.Schema;

let ProductSchema = new Schema({
    ProName:{
        type: String,
        minlength: 5,
        maxlength: 100
    },
    Material : {
        type: String
    },
    Price: {
        type: Number
    },
    Img_link : {
        type: String
    },
    InStock: {
        type: Number
    }
})

export  default Mongoose.model('Product', ProductSchema);
