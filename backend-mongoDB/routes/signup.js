import express from "express";
// import pool from "../pool.js";
import bcrypt from 'bcrypt';

import Customers from "../Models/customers.js"; 
const router = express.Router();

router.post('/customer', async (req, res) => {
     const { email, password, first_name, last_name, city='', street_address='', apt_number='',
        state='', country='', zipcode } = req.body;

    try {
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
            res.status(200).json({msg: "Customer Signup Successful", c});
        });
    } catch(error) {
        console.log("error==", error);
        return res.status(500).json({msg: error});
    }
});

export default router;