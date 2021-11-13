import mongoose from "mongoose";
import Restaurants from "../Models/restaurants.js";
import Customers from "../Models/customers.js";
import Orders from "../Models/orders.js";

async function handle_request(req, callback) { 
    try {
        const customer_id = req.params.id;
        let page = req.query.page || 1;
        let pageSize = req.query.pageSize || 5;
        let orders = await Orders.find({customer_id})
        let pageMax = Math.ceil(orders.length / pageSize);
            if (page > pageMax) {
                page = pageMax;
            }
            let start = (page - 1) * pageSize;
            let end = page * pageSize;
            orders = orders.slice(start,end);
        callback(null, {status_code: 200, response: {data: orders, page, pageSize}});
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