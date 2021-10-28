import mongoose from "mongoose";
import Restaurants from "../Models/restaurants.js";
import Customers from "../Models/customers.js";
import Orders from "../Models/orders.js";

async function handle_request(req, callback) { 
    try {
        const customer_id = req.params.id;
        const orders = await Orders.find({customer_id})
        callback(null, {status_code: 200, response: {data: orders}});
        return;
    } catch(error) {
        console.log(error);
        callback(null, {status_code: 500, response: error});
        return;
    }
}

export default {
    handle_request
};