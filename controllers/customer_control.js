import mongoose from "mongoose";
import Customer from "../models/customer.js";

export const CreateCustomer = async (req, res) => {
    try {
        await Customer.create(req.body);
        res.json({
            "message": "Customer Created"
        });
    }
    catch (err) {
        console.log(err);
    }
}
