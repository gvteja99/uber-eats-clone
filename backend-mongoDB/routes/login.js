import express from "express";
// import pool from "../pool.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import config from "../utils/config.js";
import Customers from "../Models/customers.js"; 
const router = express.Router();

router.post('/customer', async (req, res) => {
    const { email, password } = req.body;

    const queryPromise1 = async () => {
        const sql1 = `SELECT * from customers where email = '${email}';`;
        console.log("sql1:", sql1);
        return new Promise((resolve, reject)=>{
            pool.query(sql1,  (error1, result1)=>{
                if(error1){
                    console.log("error1:", error1);
                    return reject(error1);
                }
                console.log("result1:", result1);
                return resolve(result1);
            });
        });
            // return result;
        // });
    };
    const queryPromise2 = async (token, hash, result1) => {
            const sql2 = `UPDATE customers SET token= '${token}' where email = '${email}';`;
            console.log("sql2:", sql2);
            return new Promise((resolve, reject)=>{
                pool.query(sql2,  (error2, result2)=>{
                    if(error2){
                        console.log("error2:", error2);
                        return reject(error2);
                    }
                    console.log("result2:", result2);
                    return resolve(result2);
                });
            })
    };
    const queryPromise3 = (customer) => {
        const sql3 = `Select street_address, apt_number, city, state, country, zipcode from addresses where address_id = '${customer?.customer_address_id}';`;
        console.log("sql3:", sql3);
        return new Promise((resolve, reject)=>{
            pool.query(sql3,  (error3, result3)=>{
                if(error3){
                    console.log("error3:", error3);
                    return reject(error3);
                }
                console.log("result3:", result3);
                return resolve(result3);
            });
        });
    };
    try {
        const customer = await Customers.findOne({email})
        // console.log("====customer", customer);
        if (!customer) {
            res.status(400).json({msg: "Invalid email"});
        }
        const match = await bcrypt.compare(password, customer.password);
        if (!match) {
            res.status(400).json({msg: "Invalid password"});
        }
        // console.log("==", customer._id);
        const token = jwt.sign({ email}, config.token_key, {expiresIn: "2h"});
        console.log("token", token)
        customer.token = token;
        await customer.save();
        res.status(200).json(customer);
    } catch(error) {
        console.log("======inside catch:");
        console.log("error==", error);
        return res.status(500).json({msg: error});
    }
});

export default router;
