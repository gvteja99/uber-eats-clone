import mongoose from "mongoose";
import Restaurants from "../Models/restaurants.js";
import Customers from "../Models/customers.js";
import Orders from "../Models/orders.js";

async function handle_request(req, callback) { 
    try {
        const { order_id, delivery_status, res_id} = req.body;
        // Single Rest to Order
        let order = await Orders.findById(order_id);
        order.delivery_status = delivery_status;
        order = await order.save();
        const updatedOrders = await Orders.find({res_id});
        // console.log("updatedOrders", updatedOrders);
        // return res.status(200).json({data: updatedOrders});
        callback(null, {status_code: 200, response: {data: updatedOrders}});
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