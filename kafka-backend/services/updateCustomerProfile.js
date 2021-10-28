import mongoose from "mongoose";
import Restaurants from "../Models/restaurants.js";
import Customers from "../Models/customers.js";
import Orders from "../Models/orders.js";

async function handle_request(req, callback) { 
    try {
        const { customer_id, address_id, email, first_name, last_name, phone_number, dob, nickname, profile_pic, about,
            street_address, apt_number, city,  state, country, zipcode } = req.body;    
        const update = {
            email, first_name, last_name, phone_number, dob, nickname, profile_pic, about,
            address: {
                street_address,
                apt_number,
                city,
                state,
                country,
                zipcode,
            }
        }
        const result = await Customers.findByIdAndUpdate(customer_id, update, { new:true });
        callback(null, {status_code: 200, response: result});
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