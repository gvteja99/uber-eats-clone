import express from "express";
// import pool from "../pool.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
// const passport = require("passport");
import passport from "passport";
import usepassport from "../middleware/passport.js";
import config from "../utils/config.js";
import Customers from "../Models/customers.js"; 
import Restaurants from "../Models/restaurants.js";
const router = express.Router();

usepassport(passport);

router.post('/customer', async (req, res) => {
    const { email, password } = req.body;
    try {
        const customer = await Customers.findOne({email})
        if (!customer) {
            res.status(400).json({msg: "Invalid email"});
        }
        const match = await bcrypt.compare(password, customer.password);
        if (!match) {
            res.status(400).json({msg: "Invalid password"});
        }
        const token = jwt.sign({ email}, config.token_key, {expiresIn: "2h"});
        customer.token = "Bearer "+ token;
        await customer.save();
        res.status(200).json(customer);
    } catch(error) {
        console.log("======inside catch:");
        console.log("error==", error);
        return res.status(500).json({msg: error});
    }
});

router.post('/restaurant', async (req, res) => {
    const { email, password } = req.body;
    try {
        const restaurant = await Restaurants.findOne({email})
        if (!restaurant) {
            res.status(400).json({msg: "Invalid email"});
        }
        const match = await bcrypt.compare(password, restaurant.password);
        if (!match) {
            res.status(400).json({msg: "Invalid password"});
        }
        const token = jwt.sign({ email}, config.token_key, {expiresIn: "2h"});
        restaurant.token = token;
        await restaurant.save();
        res.status(200).json(restaurant);
    } catch(error) {
        console.log("======inside catch:");
        console.log("error==", error);
        return res.status(500).json({msg: error});
    }
});

export default router;
