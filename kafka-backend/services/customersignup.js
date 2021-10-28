import mongoose from "mongoose";
import Restaurants from "../Models/restaurants.js";
import Customers from "../Models/customers.js";
import bcrypt from 'bcrypt';

async function handle_request(req, callback) { 
    try {
        const { email, password, first_name, last_name, city='', street_address='', apt_number='',
        state='', country='', zipcode } = req.body;
        const existingUser =  await Customers.findOne({email: email});
        if (existingUser) {
            callback(null, {status_code: 400, response: "Customer with given email already exist"})
            // return res.status(400).end("Customer with given email already exist");
            return
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
            // res.status(200).json({msg: "Customer Signup Successful", data: c});
            callback(null, {status_code: 200, response: {msg: "Customer Signup Successful", data: c} })
            return;
        });
    } catch(error) {
        console.log("error==", error);
        callback(null, {status_code: 500, response: {msg: error}});
        return;
        // return res.status(500).json({msg: error});
    }
    

}

export default {
    handle_request
};