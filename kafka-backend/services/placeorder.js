import mongoose from "mongoose";
import Restaurants from "../Models/restaurants.js";
import Customers from "../Models/customers.js";
import Orders from "../Models/orders.js";

async function handle_request(req, callback) { 
    try {
        const { customer_id, first_name, last_name, cart, delivery_type, delivery_address, order_date_time, total_amount, delivery_fee, taxes, instruction, tip }= req.body;
        // For single Rest order place:
        let cartList = cart?.length > 0 && cart[0]
        let order_items = [];
        cartList?.dishes.map(dish => {
            order_items.push({
                res_id: dish.res_id,
                res_menu_id: dish.res_menu_id,
                dish_name: dish.dish_name,
                description: dish.description,
                quantity: dish.quantity,
                dish_price: dish.dish_price, 
                dish_category: dish.dish_category,
                food_type: dish.food_type,
            })
        })

        let orderPayload = {
            res_id: cartList._id,
            res_name: cartList.name,
            customer_id,
            first_name,
            last_name,
            order_date_time,
            delivery_type,
            delivery_address,
            delivery_fee,
            taxes,
            tip,
            instruction,
            total_amount,
            order_items,
        }

        const order = new Orders({...orderPayload}); 
        const savedOrder = await order.save()
        callback(null, {status_code: 200, response: savedOrder});
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