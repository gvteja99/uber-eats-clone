import express from "express";
// import pool from "../pool.js";
import auth from "../middleware/auth.js";
import Customers from "../Models/customers.js";
import multer from "multer";
import { fileURLToPath } from 'url';
import  path, {dirname} from "path";
import fs from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Update customer profile:
router.put('/profile', async (req, res) => {
    const { customer_id, address_id, email, first_name, last_name, phone_number, dob, nickname, profile_pic, about,
        street_address, apt_number, city,  state, country, zipcode } = req.body;
    try {
        const update = {
            email, first_name, last_name, phone_number, dob, nickname, profile_pic, about,
            address: {
                street_address,
                apt_number,
                city,
                state,
                country,
                zipcode,
            }
        }
        const result = await Customers.findByIdAndUpdate(customer_id, update, { new:true });
        res.status(200).json(result);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

export default router;