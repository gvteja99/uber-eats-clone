import mongoose from "mongoose";
import Restaurants, {Dish} from "../Models/restaurants.js";
import Customers from "../Models/customers.js";
import Orders from "../Models/orders.js";

async function handle_request(req, callback) {
    try {
        const { dish_name, dish_image, dish_price, description, main_ingredient, dish_category, food_type} = req.body;
        const res_id = req.params.id;
        const dishObj = new Dish({
            dish_name, dish_image, dish_price, description, main_ingredient, dish_category, food_type, res_id
        });
        const r = await Restaurants.findById(res_id);
        r.dishes.push(dishObj);
        await r.save();
        // TODO: Now complete res is set
        // return res.status(200).json({ data: r, dish: dishObj });
        callback(null, {status_code: 200, response: { data: r, dish: dishObj }});
        return;
    } catch(error) {
        console.log(error);
        // return res.status(500).json(error);
        callback(null, {status_code: 500, response: error});
        return;
    }
}

export default {
    handle_request
};