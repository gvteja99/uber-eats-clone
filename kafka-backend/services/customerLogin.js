import mongoose from "mongoose";
import Restaurants from "../Models/restaurants.js";
import Customers from "../Models/customers.js";
import Orders from "../Models/orders.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

async function handle_request(req, callback) { 
    try {
        const { email, password } = req.body;
        const customer = await Customers.findOne({email})
        if (!customer) {
            callback(null, {status_code: 400, response: {msg: "Invalid email"}});
            return;
        }
        const match = await bcrypt.compare(password, customer.password);
        if (!match) {
            // res.status(400).json({msg: "Invalid password"});
            callback(null, {status_code: 400, response: {msg: "Invalid password"}});
            return;
            
        }
        console.log("==========about to go");
        const token = jwt.sign({ email}, 'jwt_ubereats', {expiresIn: "2h"});
        customer.token = "Bearer "+ token;
        await customer.save();
        // res.status(200).json(customer);
        callback(null, {status_code: 200, response: customer});
        return;
    } catch(error) {
        console.log("======inside catch:");
        console.log("error==", error);
        // return res.status(500).json({msg: error});
        callback(null, {status_code: 500, response: {msg: error}});
        return;
    }
}

export default {
    handle_request
};