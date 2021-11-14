import express from "express";
// import pool from "../pool.js";
import auth from "../middleware/auth.js";
import passport from "passport";
import Customers from "../Models/customers.js";
import Restaurants from "../Models/restaurants.js";
import Orders from "../Models/orders.js";
import multer from "multer";
import { fileURLToPath } from 'url';
import  path, {dirname} from "path";
import fs from 'fs';

import kafka from "../kafka/client.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//get customer profile:
// auth,
router.get('/:id/profile',
    //  passport.authenticate("jwt", { session: false }),
    async (req, res) => {
    const reqObj = {
        query: req.query, params: req.params, body: req.body,
    }
    kafka.make_request("getCustomerProfile", reqObj, function (err, results) {
        if (err) {
            console.log("err", err);
            return res.status(500).json(err);
        } else {
            const {status_code, response} = results;
            return res.status(status_code).json(response);
        }
    });
});


//Update customer profile:
router.put('/profile', passport.authenticate("jwt", { session: false }), async (req, res) => {
    const reqObj = {
        query: req.query, params: req.params, body: req.body,
    }
    kafka.make_request("updateCustomerProfile", reqObj, function (err, results) {
        if (err) {
            console.log("err", err);
            return res.status(500).json(err);
        } else {
            const {status_code, response} = results;
            return res.status(status_code).json(response);
        }
    });
});

router.get('/:id/favourites',
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const customer_id = req.params.id;
        // console.log("req====", req.user);
        // customer = req.user
        try {
            let customer = await Customers.findById(customer_id);
            if (!customer) {
                return res.status(400).send("Customer not found");
            }
            const restaurantIds = customer.favourites.toObject();
            const favourites = await Restaurants.find({_id: {$in: restaurantIds}});
            return res.status(200).json({data: favourites});
        } catch(error) {
            console.log(error);
            return res.status(500).json(error);
        }
});

router.post('/favourites', async (req, res) => {
    const { customer_id, res_id }= req.body;
    console.log("req.body", req.body)
    try {
        let customer = await Customers.findById( customer_id );
        if (!customer) {
            return res.status(400).send("Customer not found");
        }
        const index = customer.favourites.findIndex(item =>  item && item.toString() === res_id);
        if (index !== -1) {
            return res.status(400).send("Restaurant Already present in favourites");
        }
        customer.favourites.push(res_id);
        let updatedCustomer = await customer.save()
        return res.status(200).json({data: updatedCustomer});
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.delete('/:id/favourites/:res_id', passport.authenticate("jwt", { session: false }), async (req, res) => {
    const customer_id = req.params.id;
    const res_id = req.params.res_id;
    try {
        let customer = await Customers.findById(customer_id);
        const idx = customer.favourites.findIndex(item => item && item.toString() === res_id);
        if (idx !== -1) {
            customer.favourites.splice(idx, 1);
        } else {
            return res.status(400).send("Res is not in favourites");
        }
        customer = await customer.save();
        const restaurantIds = customer.favourites.toObject();
        const favourites = await Restaurants.find({_id: {$in: restaurantIds}});
        return res.status(200).json({data: favourites});
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

// router.get('/:id/delivery_address', async (req, res) => {
//     const customer_id = req.params.id;
//     const queryPromise1 = () => {
//         const sql1 = `select * from delivery_addresses where customer_id='${customer_id}';`;
//         console.log("sql1:", sql1);
//         return new Promise((resolve, reject)=>{
//             pool.query(sql1,  (error1, result1)=>{
//                 if(error1){
//                     console.log("error1:", error1);
//                     return reject(error1);
//                 }
//                 console.log("result1:", result1);
//                 return resolve(result1);
//             });
//         });
//     };
//     try {
//         const result1 = await queryPromise1();
//         console.log("result1[0]:", result1);
//         let res_body = { data: result1};
//         return res.status(200).json(res_body);
//     } catch(error) {
//         console.log(error);
//         return res.status(500).json(error);
//     }
// });

// auth
router.post('/delivery_address', passport.authenticate("jwt", { session: false }), async (req, res) => {
    const  { customer_id, delivery_address } = req.body;
    try {
        let c = await Customers.findById(customer_id);
        c.delivery_addresses.push({delivery_address});
        c = await c.save();
        return res.status(200).json({data: c})
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

//TODO:
router.get('/:id/orders', passport.authenticate("jwt", { session: false }), async (req, res) => {
    const reqObj = {
        query: req.query, params: req.params, body: req.body,
    }
    kafka.make_request("getCustomerOrders", reqObj, function (err, results) {
        if (err) {
            console.log("err", err);
            return res.status(500).json(err);
        } else {
            const {status_code, response} = results;
            return res.status(status_code).json(response);
        }
    });
});

router.post('/orders', passport.authenticate("jwt", { session: false }), async (req, res) => {
    const reqObj = {
        query: req.query, params: req.params, body: req.body,
    }
    kafka.make_request("placeorder", reqObj, function (err, results) {
        if (err) {
            console.log("err", err);
            return res.status(500).json(err);
        } else {
            const {status_code, response} = results;
            return res.status(status_code).json(response);
        }
    });
});

export default router;