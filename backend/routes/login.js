import express from "express";
import pool from "../pool.js";
import jwt from "jsonwebtoken";
import config from "../config.js";
const router = express.Router();

router.post('/customer', async (req, res) => {
    const { email, password } = req.body;

    const queryPromise1 = () => {
        const sql1 = `SELECT * from customers where email = '${email}' and password = '${password}';`;
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
    };
    const queryPromise2 = (token) => {
        
        const sql2 = `UPDATE customers SET token= '${token}' where email = '${email}' and password = '${password}';`;
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
        });
    };
    let token;
    try {
        const result1 = await queryPromise1();
        if (!(result1 && result1.length > 0)) {
            return res.status(400).json("Invalid credentials");
        }
        const customer_id = result1[0]?.customer_id; 
        console.log("result1[0]:", customer_id);
        token = jwt.sign({customer_id, email}, config.token_key, {expiresIn: "2h"})
        const result2 = await queryPromise2(token);
        const res_body = {
        }
        Object.assign(res_body, result1[0], { token });
        return res.status(200).json(res_body);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.post('/restaurant', async (req, res) => {
    const { email, password } = req.body;

    const queryPromise1 = () => {
        const sql1 = `SELECT * from restaurants where email = '${email}' and password = '${password}';`;
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
    };
    const queryPromise2 = (token) => {
        
        const sql2 = `UPDATE restaurants SET token= '${token}' where email = '${email}' and password = '${password}';`;
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
        });
    };
    let token;
    try {
        const result1 = await queryPromise1();
        if (!(result1 && result1.length > 0)) {
            return res.status(400).json("Invalid credentials");
        }
        const res_id = result1[0]?.res_id; 
        token = jwt.sign({res_id, email}, config.token_key, {expiresIn: "2h"})
        const result2 = await queryPromise2(token);
        let res_body = {};
        Object.assign(res_body, result1[0], { token });
        return res.status(200).json(res_body);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});


export default router;