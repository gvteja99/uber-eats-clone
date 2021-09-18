import express from "express";
import pool from "../pool.js";
import auth from "../middleware/auth.js";
const router = express.Router();


//Update restaurant profile:
router.put('/profile', auth, async (req, res) => {
    const { res_id, address_id, name, delivery_option, phone_number, description, timing_open, timing_close, street_address,
        apt_number, city,  state, country, zipcode, isAddressUpdated = true} = req.body;
    const queryPromise1 = () => {
        const sql1 = `UPDATE addresses SET street_address= '${street_address}', apt_number= '${apt_number}', city= '${city}', 
            state= '${state}', country= '${country}', zipcode= '${zipcode}' 
            where address_id= '${address_id}'`;
        console.log("sql1:", sql1);
        return new Promise((resolve, reject)=>{
            pool.query(sql1,  (error1, result1, fields1)=>{
                if(error1){
                    // console.log("error1:", error1);
                    return reject(error1);
                }
                // console.log("result1:", result1);
                // console.log("fields1:", fields1);
                return resolve(result1);
            });
        });
    };
    const queryPromise2 = () => {
        const sql2 = `UPDATE restaurants SET name= '${name}', delivery_option= '${delivery_option}', phone_number= '${phone_number}', 
        description= '${description}', timing_open= '${timing_open}', timing_close= '${timing_close}' 
            where res_id= '${res_id}'`;
        console.log("sql2:", sql2);
        return new Promise((resolve, reject)=>{
            pool.query(sql2,  (error2, result2, fields2)=>{
                if(error2){
                    // console.log("error2:", error2);
                    return reject(error2);
                }
                // console.log("result2:", result2);
                // console.log("fields2:", fields2);
                return resolve(result2);
            });
        });
    };
    const queryPromise3 = () => {
        const sql3 = `select r.res_id, r.email, r.address_id, r.name, r.phone_number, r.delivery_option, r.description, r.timing_open, r.timing_close,
            a.street_address, a.apt_number, a.city, a.state, a.country, a.zipcode
            from restaurants as r INNER JOIN addresses as a ON r.address_id = a.address_id where r.res_id='${res_id}';`;
        console.log("sql3:", sql3);
        return new Promise((resolve, reject)=>{
            pool.query(sql3,  (error3, result3, fields3)=>{
                if(error3){
                    console.log("error3:", error3);
                    return reject(error3);
                }
                // console.log("result3:", result3);
                // console.log("fields3:", fields3);
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
        console.log("update profile:", result3[0])
        // let res_body = { res_menu_id: result1.insertId};
        return res.status(200).json(result3[0]);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

// get all restaurants
// TODO: add auth
router.get('/', async (req, res) => {
    console.log("req==", req.user);
    const queryPromise1 = () => {
        const sql1 = `SELECT * from restaurants;`;
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
            return res.status(400).json("Empty List");
        }
        console.log("result1[0]:", result1);
        let res_body = { data: result1};
        return res.status(200).json(res_body);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

// get restaurant dishes
router.get('/:id/dishes', auth, async (req, res) => {
    const res_id = req.params.id;
    const queryPromise1 = () => {
        const sql1 = `SELECT * from restaurant_menu where res_id=${res_id};`;
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
            return res.status(400).json("Empty List");
        }
        console.log("result1[0]:", result1);
        let res_body = { data: result1};
        return res.status(200).json(res_body);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

// add a restaurant dish
router.post('/:id/dish', auth, async (req, res) => {
    const { dish_name, dish_image, dish_price, description, main_ingredient, dish_category, food_type} = req.body;
    const res_id = req.params.id;
    const queryPromise1 = () => {
        const sql1 = `INSERT INTO restaurant_menu (res_id, dish_name, dish_image, dish_price, description, main_ingredient, dish_category, food_type)
    VALUES ('${res_id}', '${dish_name}', '${dish_image}', '${dish_price}', '${description}', '${main_ingredient}', '${dish_category}', ${food_type});`
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
        let res_body = { res_menu_id: result1.insertId};
        return res.status(200).json(res_body);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

// update a restaurant dish
router.put('/:res_id/dish/:id', auth, async (req, res) => {
    const { dish_name, dish_image, dish_price, description, main_ingredient, dish_category, food_type} = req.body;
    const res_id = req.params.res_id;
    const res_menu_id = req.params.id;
    const queryPromise1 = () => {
        const sql1 = `UPDATE restaurant_menu SET dish_name= '${dish_name}', dish_image= '${dish_image}', dish_price= '${dish_price}', 
            main_ingredient= '${main_ingredient}', dish_category= '${dish_category}', food_type= '${food_type}' 
            where res_menu_id='${res_menu_id}' and res_id= '${res_id}'`;
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
    try {
        const result1 = await queryPromise1();
        // let res_body = { res_menu_id: result1.insertId};
        return res.status(200).json("Dish is updated successfully");
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

// delete a restaurant dish
router.delete('/:res_id/dish/:id', auth, async (req, res) => {
    // const { dish_name, dish_image, dish_price, description, main_ingredient, dish_category, food_type} = req.body;
    const res_id = req.params.res_id;
    const res_menu_id = req.params.id;
    const queryPromise1 = () => {
        const sql1 = `DELETE FROM restaurant_menu where res_menu_id='${res_menu_id}' and res_id= '${res_id}'`;
        console.log("sql1:", sql1);
        return new Promise((resolve, reject)=>{
            pool.query(sql1,  (error1, result1, fields1)=>{
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
        // let res_body = { res_menu_id: result1.insertId};
        return res.status(200).json("Dish is deleted successfully");
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

export default router;

// let req = 
// {
//     "dish_name": "cake",
//     "dish_image": "",
//     "dish_price": 9.5,
//     "description": "",
//     "main_ingredient": "sdfdf",
//     "dish_category": 'desserts',
//     "food_type": 1
// }