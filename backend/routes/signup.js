import express from "express";
import pool from "../pool.js";
const router = express.Router();

router.post('/customer', async (req, res) => {
    const { email, password, first_name, last_name, city=null, street_address=null, apt_number=null,
        state=null, country=null, zipcode=null } = req.body;
    const sql1 = `SELECT customer_id from customers where email = '${req.body.email}';`;
    const sql2 = `INSERT INTO addresses (street_address, apt_number, city, state, country, zipcode) 
        VALUES ('${street_address}', '${apt_number}', '${city}', '${state}' , '${country}', '${zipcode}');`
    const queryPromise1 = () => {
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
    const queryPromise2 = () => {
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
    const queryPromise3 = (address_id) => {
        const sql3 = `INSERT INTO customers (first_name, last_name, email, password, customer_address_id)
            VALUES ('${first_name}', '${last_name}', '${email}', '${password}', '${address_id}');`
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
        const result1 = await queryPromise1();
        if (result1 && result1.length > 0) {
            return res.status(400).json("Email should be unique");
        }
        const result2 = await queryPromise2(result1);
        console.log("insertID: ", result2.insertId);
        const result3 = await queryPromise3(result2.insertId);
        console.log("result3:", result3);
        res.status(200).json("Signup Successful");
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.post('/restaurant', async (req, res) => {
    const { email, password, name, city, street_address=null, apt_number=null,
        state, country, zipcode=null
    } = req.body;

    const queryPromise1 = () => {
        const sql1 = `SELECT res_id from restaurants where email = '${req.body.email}';`;
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
    const queryPromise2 = (result1) => {
        const sql2 = `INSERT INTO addresses (street_address, apt_number, city, state, country, zipcode) 
        VALUES ('${street_address}', '${apt_number}', '${city}', '${state}' , '${country}', '${zipcode}');`
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
    const queryPromise3 = (address_id) => {
        const sql3 = `INSERT INTO restaurants (name, email, password, address_id) 
        VALUES ('${name}', '${email}', '${password}', '${address_id}');`
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
        const result1 = await queryPromise1();
        if (result1 && result1.length > 0) {
            return res.status(400).json("Email should be unique");
        }
        const result2 = await queryPromise2(result1);
        console.log("insertID: ", result2.insertId);
        const result3 = await queryPromise3(result2.insertId);
        console.log("result3:", result3);
        res.status(200).json("Signup Successful");
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

export default router;