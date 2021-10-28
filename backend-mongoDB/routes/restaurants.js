import express from "express";
import auth from "../middleware/auth.js";
import Restaurants, {Dish} from "../Models/restaurants.js";
import mongoose from "mongoose";
// import Orders from "../Models/orders.js";
import kafka from "../kafka/client.js";
const router = express.Router();


// get all restaurants
// TODO: add auth
router.get(`/`, async (req, res) => {
    // console.log("req.query", req.query)
    // const { customer_city, search } =  req.query;
    const queryPromise1 = () => {
        // const sql1 = `SELECT * from restaurants;`;
        let sql1;
        let search_string = `%${search}%`
        if (!search) {
         sql1 = `select r.res_id, r.email, r.address_id, r.name, r.phone_number, r.delivery_option, r.description, r.timing_open, r.timing_close,
            a.street_address, a.apt_number, a.city, a.state, a.country, a.zipcode
            from restaurants as r INNER JOIN addresses as a ON r.address_id = a.address_id order by a.city= '${customer_city}' DESC;`;
            
        }
        else {
            sql1 = `select DISTINCT r.res_id, r.email, r.address_id, r.name, r.phone_number, r.delivery_option, r.description, r.timing_open, r.timing_close,
            a.street_address, a.apt_number, a.city, a.state, a.country, a.zipcode
            from restaurants as r INNER JOIN addresses as a ON r.address_id = a.address_id Left Outer join restaurant_menu as d ON r.res_id = d.res_id where
            d.dish_name LIKE '${search_string}' or r.name LIKE '${search_string}' or d.description LIKE '${search_string}' or a.city LIKE '${search_string}'
            order by a.city= '${customer_city}' DESC;`;
        }
        // console.log("sql1:", sql1);
            return new Promise((resolve, reject)=>{
                pool.query(sql1,  (error1, result1)=>{
                    if(error1){
                        console.log("error1:", error1);
                        return reject(error1);
                    }
                    // console.log("result1:", result1);
                    return resolve(result1);
                });
            });
       
    };
    try {
        const reqObj = {
            query: req.query, params: req.params, body: req.body,
        }
        kafka.make_request("getRestaurants", reqObj, function (err, results) {
            if (err) {
                console.log("err", err);
            } else {
              res.status(200).json(results);
            }
          });
        // // TODO: Search and customer city sort option
        // const resList = await Restaurants.find({});
        // console.log("resList", resList);
        // return res.status(200).json({data: resList});
    } catch(error) {
        console.log("error:", error);
        return res.status(500).json(error);
    }
});

//Update restaurant profile:
// TODO: auth
router.put('/profile',  async (req, res) => {
    // address_id
    const { res_id, name, delivery_option, phone_number, description, timing_open, timing_close, street_address,
        apt_number, city,  state, country, zipcode} = req.body;
    try {
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
        res.status(200).json(result);

    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

// add a restaurant dish
// auth
router.post('/:id/dish', async (req, res) => {

    const reqObj = {
        query: req.query, params: req.params, body: req.body,
    }
    kafka.make_request("addDish", reqObj, function (err, results) {
        if (err) {
            console.log("err", err);
            return res.status(500).json(err);
        } else {
            const {status_code, response} = results;
            return res.status(status_code).json(response);
        }
    });
});


// update a restaurant dish
router.put('/:res_id/dish/:id', async (req, res) => {
    const reqObj = {
        query: req.query, params: req.params, body: req.body,
    }
    kafka.make_request("updateDish", reqObj, function (err, results) {
        if (err) {
            console.log("err", err);
            return res.status(500).json(err);
        } else {
            const {status_code, response} = results;
            return res.status(status_code).json(response);
        }
    });
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
    const res_id = req.params.id;
    try {
        const orders = await Orders.find({res_id});
        return res.status(200).json({data: orders});
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.put('/order', async (req, res) => {
    const { order_id, delivery_status, res_id} = req.body;
    try {
        // const result1 = await queryPromise1();
        // const result2 = await queryPromise2();
        // // console.log("result1[0]:", result1);
        // let res_body = { data: result2};
        // return res.status(200).json(res_body);
        // Single Rest to Order
        let order = await Orders.findById(order_id);
        order.delivery_status = delivery_status;
        order = await order.save();
        const updatedOrders = await Orders.find({res_id});
        console.log("updatedOrders", updatedOrders);
        return res.status(200).json({data: updatedOrders});

    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});



export default router;