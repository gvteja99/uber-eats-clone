import mongoose from "mongoose";
import Restaurants from "../Models/restaurants.js";
// import Customer from "../Models/customers.js";

async function handle_request(req, callback) { 
    try {
        // console.log("req", req);
        const { customer_city, search } =  req.query;
        // TODO: Search and customer city sort option
        const resList = await Restaurants.find({});
        console.log("resList", resList);
        const res = {data: resList}
        callback(null, res);
    } catch(err) {
        console.log("error2", err)
    }
    
    // return res.status(200).json({data: resList});

}

export default {
    handle_request
};