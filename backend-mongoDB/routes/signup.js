import express from "express";
// import pool from "../pool.js";
import bcrypt from 'bcrypt';

import Customers from "../Models/customers.js"; 
import Restaurants from "../Models/restaurants.js";
// import kafka from "../kafka/client.js";

const router = express.Router();

router.post('/customer', async (req, res) => {
    try {
        const { email, password, first_name, last_name, city='', street_address='', apt_number='',
        state='', country='', zipcode } = req.body;
        const existingUser =  await Customers.findOne({email: email});
        if (existingUser) {
            return res.status(400).end("Customer with given email already exist");
        }
        const result = await bcrypt.hash(password, 10, async function(err, hash) {
            const customerBody = new Customers({
                first_name,
                last_name,
                email,
                password: hash,
                phone_number: '',
                dob: '',
                nickname: '',
                profile_pic: '',
                about: '',
                address: {
                    street_address,
                    apt_number,
                    city,
                    state,
                    country,
                    zipcode,
                },
            });
            const c = await customerBody.save();
            console.log("======c====", c);
            return res.status(200).json({msg: "Customer Signup Successful", data: c});
        });
    } catch(error) {
        console.log("error==", error);
        return res.status(500).json({msg: error});
    }  
});

router.post('/restaurant', async (req, res) => {
    try {
        const { 
            email, password, name, city, street_address='', apt_number='', state, country, zipcode=null
        } = req.body;

        const existingUser =  await Restaurants.findOne({email: email});
        if (existingUser) {
            return res.status(400).end("Restaurant with given email already exist");
        }
        const result = await bcrypt.hash(password, 10, async function(err, hash) {
            const resBody = new Restaurants({
                name,
                email,
                password: hash,
                phone_number: '',
                description: '',
                timing_open: '',
                timing_close: '',
                token: '',
                address: {
                    street_address,
                    apt_number,
                    city,
                    state,
                    country,
                    zipcode,
                },
                dishes: []
            });
            const r = await resBody.save();
            // console.log("======r====", r);
            return res.status(200).json({msg: "Res Signup Successful", data: r});

        });
        
    } catch(error) {
        console.log("error==", error);
        return res.status(500).json({msg: error});
    }
});

export default router;