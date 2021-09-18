import express from "express";
import pool from "../pool.js";
import auth from "../middleware/auth.js";
const router = express.Router();

//Update customer profile:
router.put('/profile', auth, async (req, res) => {
    const { customer_id, address_id, email, first_name, last_name, phone_number, dob, nickname, profile_pic, about,
        street_address, apt_number, city,  state, country, zipcode, isAddressUpdated = true } = req.body;
    const queryPromise1 = () => {
        const sql1 = `UPDATE addresses SET street_address= '${street_address}', apt_number= '${apt_number}', city= '${city}', 
            state= '${state}', country= '${country}', zipcode= '${zipcode}' 
            where address_id= '${address_id}'`;
        console.log("sql1:", sql1);
        return new Promise((resolve, reject)=>{
            pool.query(sql1,  (error1, result1, fields1)=>{
                if(error1){
                    console.log("error1:", error1);
                    return reject(error1);
                }
                console.log("result1:", result1);
                console.log("fields1:", fields1);
                return resolve(result1);
            });
        });
    };
    const queryPromise2 = () => {
        const sql2 = `UPDATE customers SET email= '${email}', first_name= '${first_name}', last_name= '${last_name}', phone_number= '${phone_number}', 
            dob= '${dob}', nickname= '${nickname}', profile_pic= '${profile_pic}', about= '${about}'
            where customer_id= '${customer_id}'`;
        console.log("sql2:", sql2);
        return new Promise((resolve, reject)=>{
            pool.query(sql2,  (error2, result2, fields2)=>{
                if(error2){
                    console.log("error2:", error2);
                    return reject(error2);
                }
                console.log("result2:", result2);
                console.log("fields2:", fields2);
                return resolve(result2);
            });
        });
    };
    const queryPromise3 = () => {
        const sql3 = `select c.customer_id, c.customer_address_id, c. c.email, c.first_name, c.last_name, c.phone_number, c.dob, c.nickname, c.profile_pic, c.about,
            a.street_address, a.apt_number, a.city, a.state, a.country, a.zipcode
            from customers as c INNER JOIN addresses as a ON c.customer_address_id = a.address_id where c.customer_id='${customer_id}';`;
        console.log("sql3:", sql3);
        return new Promise((resolve, reject)=>{
            pool.query(sql3,  (error3, result3, fields3)=>{
                if(error3){
                    console.log("error3:", error3);
                    return reject(error3);
                }
                console.log("result3:", result3);
                console.log("fields3:", fields3);
                return resolve(result3);
            });
        });
    };
    try {
        if (isAddressUpdated) {
            const result1 = await queryPromise1();
        }
        const result2 = await queryPromise2();
        const result3 = await queryPromise3();
        // let res_body = { res_menu_id: result1.insertId};
        return res.status(200).json(result3[0]);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

export default router;
