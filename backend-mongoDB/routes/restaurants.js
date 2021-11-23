import express from "express";
import auth from "../middleware/auth.js";
import Restaurants, {Dish} from "../Models/restaurants.js";
import Orders from "../Models/orders.js";
import mongoose from "mongoose";

const router = express.Router();


// get all restaurants
// TODO: add auth
router.get(`/`, async (req, res) => {
    try {
        const { customer_city, search } =  req.query;
        let searchStringRegex = new RegExp(req.query.search, "i");
        // TODO: Search and customer city sort option
        const resList = await Restaurants.find({ $or: [ {name: searchStringRegex}, {'address.city': searchStringRegex},  {'dishes.dish_name': searchStringRegex},  ] });
        const results = {data: resList}
        // callback(null, res);
        return res.status(200).json(results);
    } catch(error) {
        console.log("error:", error);
        return res.status(500).json(error);
    }
});

//Update restaurant profile:
// TODO: auth
router.put('/profile', async (req, res) => {
    try {
        const { res_id, name, delivery_option, phone_number, description, timing_open, timing_close, street_address,
            apt_number, city,  state, country, zipcode} = req.body;
        const update = {
            name, delivery_option, phone_number,description, timing_open, timing_close,
            address: {
                street_address,
                apt_number,
                city,
                state,
                country,
                zipcode,
            }
        }
        const result = await Restaurants.findByIdAndUpdate(res_id, update, { new:true });
        return res.status(200).json(result);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

// add a restaurant dish
// auth
router.post('/:id/dish', async (req, res) => {
    try {
        const { dish_name, dish_image, dish_price, description, main_ingredient, dish_category, food_type} = req.body;
        const res_id = req.params.id;
        const dishObj = new Dish({
            dish_name, dish_image, dish_price, description, main_ingredient, dish_category, food_type, res_id
        });
        const r = await Restaurants.findById(res_id);
        r.dishes.push(dishObj);
        await r.save();
        return res.status(200).json({ data: r, dish: dishObj });
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});


// update a restaurant dish
router.put('/:res_id/dish/:id', async (req, res) => {
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
        return res.status(200).json({ data: result, dish});
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});


// delete a restaurant dish
// auth
router.delete('/:res_id/dish/:id', async (req, res) => {
    const res_id = req.params.res_id;
    const dish_id = req.params.id;
    try {
        const result = await Restaurants.findByIdAndUpdate(res_id, {"$pull": {"dishes": { "_id": dish_id}}}, { new:true })
        return res.status(200).json({ data: result})
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

// Get orders;
router.get('/:id/orders', async (req, res) => {
    try {
        const res_id = req.params.id;
        const orders = await Orders.find({res_id});
        return res.status(200).json({data: orders});
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.put('/order', async (req, res) => {
    try {
        const { order_id, delivery_status, res_id} = req.body;
        // Single Rest to Order
        let order = await Orders.findById(order_id);
        order.delivery_status = delivery_status;
        order = await order.save();
        const updatedOrders = await Orders.find({res_id});
        return res.status(200).json({data: updatedOrders});
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});



export default router;