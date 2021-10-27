import express from "express";
import pool from "../pool.js";
import jwt from "jsonwebtoken";
import config from "../config.js";
import bcrypt from 'bcrypt';
const router = express.Router();

router.post('/customer', async (req, res) => {
    const { email } = req.body;
    const queryPromise2 = () => {
        
        const sql2 = `UPDATE customers SET token= '' where email = '${email}';`;
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
    try {
        const result2 = await queryPromise2();
        return res.status(200).json({
            successMsg: "logout successful",
            errorMsg: "",
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.post('/restaurant', async (req, res) => {
    const { email } = req.body;
    const queryPromise2 = () => {
        const sql2 = `UPDATE restaurants SET token= '' where email = '${email}';`;
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
    try {
        const result2 = await queryPromise2();
        return res.status(200).json({
            successMsg: "logout successful",
            errorMsg: "",
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});


export default router;