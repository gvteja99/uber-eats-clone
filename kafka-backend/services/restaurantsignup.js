import mongoose from "mongoose";
import Restaurants from "../Models/restaurants.js";
import Customers from "../Models/customers.js";
import bcrypt from 'bcrypt';

async function handle_request(req, callback) { 
    try {
        const { 
            email, password, name, city, street_address='', apt_number='', state, country, zipcode=null
        } = req.body;

        const existingUser =  await Restaurants.findOne({email: email});
        if (existingUser) {
            // return res.status(400).end("Restaurant with given email already exist");
            callback(null, {status_code: 400, response: "Restaurant with given email already exist"});
            return;
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
            console.log("======r====", r);
            // res.status(200).json({msg: "Res Signup Successful", data: r});
            callback(null, {status_code: 200, response: {msg: "Res Signup Successful", data: r}});
            return;

        });
        
    } catch(error) {
        console.log("error==", error);
        callback(null, {status_code: 500, response: {msg: error}});
        return;
    }

}

export default {
    handle_request
};