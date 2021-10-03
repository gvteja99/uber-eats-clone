import express from "express";
import pool from "../pool.js";
import jwt from "jsonwebtoken";
import config from "../config.js";
import bcrypt from 'bcrypt';
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
    let token;
    try {
        const result1 = await queryPromise1();

        if (!(result1 && result1.length > 0)) {
            return res.status(400).json({error: "Invalid credentials"});
        }
        const customer_id = result1[0]?.customer_id; 
        const hashPwd = result1[0]?.password;
        token = jwt.sign({customer_id, email}, config.token_key, {expiresIn: "2h"})
        console.log("hashedpwwd", hashPwd);
        const result2 = await queryPromise2(token, hashPwd, result1);
        const result3 = await queryPromise3(result1[0]);
        bcrypt.compare(password, hashPwd)
            .then((isMatch) => {
                if (!isMatch) {
                    return res.status(400).json({error: "Invalid password"});
                }
                else {
                     const res_body = {
                     }
                     Object.assign(res_body, result1[0], { token }, result3[0]);
                     return res.status(200).json(res_body);
                }
             }
        )
    } catch(error) {
        console.log("======inside catch:");
        console.log(error);
        return res.status(500).json(error);
    }
});

router.post('/restaurant', async (req, res) => {
    const { email, password } = req.body;
    const queryPromise1 = async () => {
        const sql1 = `SELECT * from restaurants where email = '${email}';`;
        // console.log("sql1:", sql1);
        return new Promise((resolve, reject)=>{
            pool.query(sql1,  (error1, result1)=>{
                if(error1){
                    // console.log("error1:", error1);c
                    return reject(error1);
                }
                // console.log("result1:", result1);
                return resolve(result1);
            });
        });
    };
    
    const queryPromise2 = (token, hash) => {
            const sql2 = `UPDATE restaurants SET token= '${token}' where email = '${email}';`;
            // console.log("sql2:", sql2);
            return new Promise((resolve, reject)=>{
                pool.query(sql2,  (error2, result2)=>{
                    if(error2){
                        // console.log("error2:", error2);
                        return reject(error2);
                    }
                    // console.log("result2:", result2);
                    return resolve(result2);
                });
        }) 
    };
    const queryPromise3 = (res) => {
        const sql3 = `Select street_address, apt_number, city, state, country, zipcode from addresses where address_id = '${res?.address_id}';`;
        // console.log("sql3:", sql3);
        return new Promise((resolve, reject)=>{
            pool.query(sql3,  (error3, result3)=>{
                if(error3){
                    // console.log("error3:", error3);
                    return reject(error3);
                }
                // console.log("result3:", result3);
                return resolve(result3);
            });
        });
    };
    let token;
    try {
        const result1 = await queryPromise1();
        if (!(result1 && result1.length > 0)) {
            return res.status(400).json({error: "Invalid credentials"});
        }
        const res_id = result1[0]?.res_id; 
        token = jwt.sign({res_id, email}, config.token_key, {expiresIn: "2h"})
        const result2 = await queryPromise2(token, result1[0].password);
        let res_body = {};
        const result3 = await queryPromise3(result1[0]);
        bcrypt.compare(password, result1[0].password)
        .then((isMatch) => {
            if (!isMatch) {
                return res.status(400).json({error: "Invalid password"});
            }
            else {
                 const res_body = {}
                console.log("result3[0]", result3);
                Object.assign(res_body, result1[0], { token }, result3[0]);
                return res.status(200).json(res_body);
            }
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});


export default router;