import express from "express";
// import pool from "../pool.js";
import bcrypt from 'bcrypt';

import Customers from "../Models/customers.js"; 
const router = express.Router();

router.post('/customer', async (req, res) => {
    const customerBody = new Customers({
        customer_id: '14567',
        first_name: 'Ayush',
        last_name: 'Gupta',
        email: 'c1@gmail.com',
        password: 12345,
        phone_number: '',
        dob: '',
        nickname: '',
        profile_pic: '',
        about: '',
        customer_address_id: '',
    })
    // const { email, password, first_name, last_name, city=null, street_address=null, apt_number=null,
    //     state=null, country=null, zipcode=null } = customerBody;
        // req.body;
    // const sql1 = `SELECT customer_id from customers where email = '${req.body.email}';`;
    // const sql2 = `INSERT INTO addresses (street_address, apt_number, city, state, country, zipcode) 
    //     VALUES ('${street_address}', '${apt_number}', '${city}', '${state}' , '${country}', '${zipcode}');`
    const queryPromise1 = () => {
        // console.log("sql1:", sql1);
        return new Promise((resolve, reject)=>{
            Customers.findOne({customer_id: '14567'}, (error, result1) => {
                if (error) {
                    console.log("error1:", error1);
                    return reject(error1);
                }
                console.log("result1:", result1);
                return resolve(result1);
            })
            // pool.query(sql1,  (error1, result1)=>{
            //     if(error1){
            //         // console.log("error1:", error1);
            //         return reject(error1);
            //     }
            //     // console.log("result1:", result1);
            //     return resolve(result1);
            // });
        });
    };
    const queryPromise2 = () => {
        // console.log("sql2:", sql2);
        return new Promise((resolve, reject)=>{
            customerBody.save((error2, result2) => {
                if(error2){
                    console.log("error2:", error2);
                    return reject(error2);
                }
                console.log("result2:", result2);
                return resolve(result2);
            })
            
            // pool.query(sql2,  (error2, result2)=>{
            //     if(error2){
            //         console.log("error2:", error2);
            //         return reject(error2);
            //     }
            //     // console.log("result2:", result2);
            //     return resolve(result2);
            // });
        });
    };
    
    // const addHashToken = async (address_id) => {
    //     const result = await bcrypt.hash(password, 10, async function(err, hash) {
    //         // Store hash in your password DB. 
    //         // console.log("hash", hash)
    //         const queryPromise3 = () => (
    //                 new Promise((resolve, reject)=>{
    //                 const sql3 = `INSERT INTO customers (first_name, last_name, email, password, customer_address_id)
    //                 VALUES ('${first_name}', '${last_name}', '${email}', '${hash}', '${address_id}');`
    //                 // console.log("sql3:=======", sql3);
    //                 pool.query(sql3,  (error3, result3)=>{
    //                     if(error3){
    //                         console.log("error3:", error3);
    //                         return reject(error3);
    //                     }
    //                     // console.log("result3:", result3);
    //                     return resolve(result3);
    //                 });
    //             }
    //         ));


    //         const result3 = await queryPromise3();
    //         res.status(200).json({msg: "Customer Signup Successful"});
    //     });
    //     return result
    // };

    try {
        const result1 = await queryPromise1();
        // if (result1 && result1.length > 0) {
        //     return res.status(400).end("Customer with given email ");
        // }
        if (result1) {
            return res.status(400).end("Customer with given email already exist");
        }
        const result2 = await queryPromise2(result1);
        // const  result = await addHashToken(result2.insertId);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

export default router;