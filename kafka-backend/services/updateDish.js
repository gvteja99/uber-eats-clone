import mongoose from "mongoose";
import Restaurants from "../Models/restaurants.js";
import Customers from "../Models/customers.js";
import Orders from "../Models/orders.js";

async function handle_request(req, callback) { 
    try {
        const { dish_name, dish_image, dish_price, description, main_ingredient, dish_category, food_type} = req.body;
        const res_id = req.params.res_id;
        const dish_id = req.params.id;
        const update = {
            dish_name, dish_image, dish_price, description, main_ingredient, dish_category, food_type
        }
        const r = await Restaurants.findById(res_id);
        let dish = r.dishes.id(mongoose.Types.ObjectId(dish_id));
        dish.set({...update});
        let result = await r.save();
        callback(null, {status_code: 200, response: { data: result, dish}});
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