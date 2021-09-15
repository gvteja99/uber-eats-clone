import express from "express";
import pool from "../pool.js";
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
    try {
        const result1 = await queryPromise1();
        if (!(result1 && result1.length > 0)) {
            return res.status(400).json("Invalid credentials");
        }
        console.log("result1[0]:", result1[0]?.customer_id);
        const res_body = {
        }
        Object.assign(res_body, result1[0]);
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
    try {
        const result1 = await queryPromise1();
        if (!(result1 && result1.length > 0)) {
            return res.status(400).json("Invalid credentials");
        }
        let res_body = {};
        Object.assign(res_body, result1[0]);
        return res.status(200).json(res_body);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});


export default router;