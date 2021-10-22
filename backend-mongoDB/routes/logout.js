import express from "express";
// import pool from "../pool.js";x
// import jwt from "jsonwebtoken";
// import config from "../utils/config.js";
// import bcrypt from 'bcrypt';
import Customers from "../Models/customers.js"; 

const router = express.Router();

router.post('/customer', async (req, res) => {
    const { email } = req.body;
    try {
        await Customers.updateOne({email}, {token: ''});
        return res.status(200).json({ msg: "logout successful" });

    } catch(error) {
        console.log("error==", error);
        return res.status(500).json({msg: error});
    }
});

export default router;