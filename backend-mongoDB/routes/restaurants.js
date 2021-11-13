import express from "express";
import auth from "../middleware/auth.js";
import Restaurants, {Dish} from "../Models/restaurants.js";
import Orders from "../Models/orders.js";
import mongoose from "mongoose";
// import Orders from "../Models/orders.js";
import kafka from "../kafka/client.js";
const router = express.Router();


// get all restaurants
// TODO: add auth
router.get(`/`, async (req, res) => {
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
    } catch(error) {
        console.log("error:", error);
        return res.status(500).json(error);
    }
});

//Update restaurant profile:
// TODO: auth
router.put('/profile', auth, async (req, res) => {
    // address_id
    const reqObj = {
        query: req.query, params: req.params, body: req.body,
    }
    kafka.make_request("updateRestaurantProfile", reqObj, function (err, results) {
        if (err) {
            console.log("err", err);
            return res.status(500).json(err);
        } else {
            const {status_code, response} = results;
            return res.status(status_code).json(response);
        }
    });
});

// add a restaurant dish
// auth
router.post('/:id/dish', auth, async (req, res) => {

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
router.put('/:res_id/dish/:id', auth, async (req, res) => {
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
router.delete('/:res_id/dish/:id', auth, async (req, res) => {
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
router.get('/:id/orders', auth, async (req, res) => {
    const reqObj = {
        query: req.query, params: req.params, body: req.body,
    }
    kafka.make_request("getRestaurantOrders", reqObj, function (err, results) {
        if (err) {
            console.log("err", err);
            return res.status(500).json(err);
        } else {
            const {status_code, response} = results;
            return res.status(status_code).json(response);
        }
    });
});

router.put('/order', async (req, res) => {
    const reqObj = {
        query: req.query, params: req.params, body: req.body,
    }
    kafka.make_request("updateDeliveryStatus", reqObj, function (err, results) {
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