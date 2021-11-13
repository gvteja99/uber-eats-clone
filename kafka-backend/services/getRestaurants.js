import mongoose from "mongoose";
import Restaurants from "../Models/restaurants.js";
// import Customer from "../Models/customers.js";

async function handle_request(req, callback) { 
    try {
        // console.log("req", req);
        const { customer_city, search } =  req.query;
        let searchStringRegex = new RegExp(req.query.search, "i");
        // TODO: Search and customer city sort option
        const resList = await Restaurants.find({ $or: [ {name: searchStringRegex}, {'address.city': searchStringRegex},  {'dishes.dish_name': searchStringRegex},  ] });
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