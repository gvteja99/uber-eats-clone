import express from "express";
// import pool from "../pool.js";
import bcrypt from 'bcrypt';

import Customers from "../Models/customers.js"; 
import Restaurants from "../Models/restaurants.js";
import kafka from "../kafka/client.js";

const router = express.Router();

router.post('/customer', async (req, res) => {
    const reqObj = {
        query: req.query, params: req.params, body: req.body,
    }
    kafka.make_request("customersignup", reqObj, function (err, results) {
        if (err) {
            console.log("err", err);
            return res.status(500).json(err);
        } else {
            const {status_code, response} = results;
            return res.status(status_code).json(response);
        }
      });
    
       
});

router.post('/restaurant', async (req, res) => {
    const reqObj = {
        query: req.query, params: req.params, body: req.body,
    }
    kafka.make_request("restaurantsignup", reqObj, function (err, results) {
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