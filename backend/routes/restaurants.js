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
router.get(`/`, async (req, res) => {
    // console.log("req.query", req.query)
    const { customer_city, search } =  req.query;
    const queryPromise1 = () => {
        // const sql1 = `SELECT * from restaurants;`;
        let sql1;
        let search_string = `%${search}%`
        if (!search) {
         sql1 = `select r.res_id, r.email, r.address_id, r.name, r.phone_number, r.delivery_option, r.description, r.timing_open, r.timing_close,
            a.street_address, a.apt_number, a.city, a.state, a.country, a.zipcode
            from restaurants as r INNER JOIN addresses as a ON r.address_id = a.address_id order by a.city= '${customer_city}' DESC;`;
            
        }
        else {
            sql1 = `select DISTINCT r.res_id, r.email, r.address_id, r.name, r.phone_number, r.delivery_option, r.description, r.timing_open, r.timing_close,
            a.street_address, a.apt_number, a.city, a.state, a.country, a.zipcode
            from restaurants as r INNER JOIN addresses as a ON r.address_id = a.address_id Left Outer join restaurant_menu as d ON r.res_id = d.res_id where
            d.dish_name LIKE '${search_string}' or r.name LIKE '${search_string}' or d.description LIKE '${search_string}' or a.city LIKE '${search_string}'
            order by a.city= '${customer_city}' DESC;`;
        }
        // console.log("sql1:", sql1);
            return new Promise((resolve, reject)=>{
                pool.query(sql1,  (error1, result1)=>{
                    if(error1){
                        console.log("error1:", error1);
                        return reject(error1);
                    }
                    // console.log("result1:", result1);
                    return resolve(result1);
                });
            });
       
    };
    try {
        const result1 = await queryPromise1();
        let res_body = { data: result1};
        return res.status(200).json(res_body);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

// get restaurant dishes
// TODO auth
router.get('/:id/dishes', async (req, res) => {
    const res_id = req.params.id;
    const queryPromise1 = () => {
        const sql1 = `SELECT * from restaurant_menu where res_id='${res_id}';`;
        // console.log("sql1:", sql1);
        return new Promise((resolve, reject)=>{
            pool.query(sql1,  (error1, result1)=>{
                if(error1){
                    console.log("error1:", error1);
                    return reject(error1);
                }
                // console.log("result1:", result1);
                return resolve(result1);
            });
        });
    };
    try {
        const result1 = await queryPromise1();
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
        // console.log("sql1:", sql1);
        return new Promise((resolve, reject)=>{
            pool.query(sql1,  (error1, result1)=>{
                if(error1){
                    console.log("error1:", error1);
                    return reject(error1);
                }
                // console.log("result1:", result1);
                return resolve(result1);
            });
        });
    };
    const queryPromise2 = () => {
        const sql2 = `SELECT * from restaurant_menu where res_id='${res_id}';`;
        // console.log("sql2:", sql2);
        return new Promise((resolve, reject)=>{
            pool.query(sql2,  (error2, result2)=>{
                if(error2){
                    console.log("error2:", error2);
                    return reject(error2);
                }
                // console.log("result2:", result2);
                return resolve(result2);
            });
        });
    };
    try {
        const result1 = await queryPromise1();
        const result2 = await queryPromise2();
        // let res_body = { res_menu_id: result1.insertId};
        return res.status(200).json({ data: result2 });
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

// update a restaurant dish

router.put('/:res_id/dish/:id', async (req, res) => {
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
                // console.log("result1:", result1);
                console.log("fields1:", fields1);
                return resolve(result1);
            });
        });
    };
    const queryPromise2 = () => {
        const sql2 = `SELECT * from restaurant_menu where res_id='${res_id}';`;
        console.log("sql2:", sql2);
        return new Promise((resolve, reject)=>{
            pool.query(sql2,  (error2, result2)=>{
                if(error2){
                    console.log("error2:", error2);
                    return reject(error2);
                }
                // console.log("result2:", result2);
                return resolve(result2);
            });
        });
    };
    try {
        const result1 = await queryPromise1();
        const result2 = await queryPromise2();
        // let res_body = { res_menu_id: result1.insertId};
        return res.status(200).json({ data: result2, msg: "Dish is updated successfully" });
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
                // console.log("result1:", result1);
                return resolve(result1);
            });
        });
    };
    const queryPromise2 = () => {
        const sql2 = `SELECT * from restaurant_menu where res_id='${res_id}';`;
        console.log("sql2:", sql2);
        return new Promise((resolve, reject)=>{
            pool.query(sql2,  (error2, result2)=>{
                if(error2){
                    console.log("error2:", error2);
                    return reject(error2);
                }
                // console.log("result2:", result2);
                return resolve(result2);
            });
        });
    };
    try {
        const result1 = await queryPromise1();
        const result2 = await queryPromise2();
        // let res_body = { res_menu_id: result1.insertId};
        return res.status(200).json({ data: result2, msg: "Dish is deleted" });
        // let res_body = { res_menu_id: result1.insertId};
        // return res.status(200).json("Dish is deleted successfully");
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.get('/:id/orders', async (req, res) => {
    const res_id = req.params.id;
    const queryPromise1 = () => {
        const sql1 = `select o.order_id, o.customer_id, o.order_date_time, o.delivery_date_time, o.delivery_address,
        o.delivery_status,o.taxes, o.tip, o.instruction, o.total_amount, o.delivery_type, c.first_name , c.last_name, c.email, c.phone_number, c.profile_pic
        from orders as o Inner Join customers as c on o.customer_id = c.customer_id where o.res_id='${res_id}' order by order_date_time DESC;`;
        console.log("sql1:", sql1);
        return new Promise((resolve, reject)=>{
            pool.query(sql1,  (error1, result1)=>{
                if(error1){
                    console.log("error1:", error1);
                    return reject(error1);
                }
                // console.log("result1:", result1);
                return resolve(result1);
            });
        });
    };
    try {
        const result1 = await queryPromise1();
        // console.log("result1[0]:", result1);
        let res_body = { data: result1};
        return res.status(200).json(res_body);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.put('/order', async (req, res) => {
    const { order_id, delivery_status, res_id} = req.body;
    const queryPromise1 = () => {
        const sql1 = `update orders set delivery_status='${delivery_status}' where order_id = '${order_id}';`
        console.log("sql1:", sql1);
        return new Promise((resolve, reject)=>{
            pool.query(sql1,  (error1, result1)=>{
                if(error1){
                    console.log("error1:", error1);
                    return reject(error1);
                }
                // console.log("result1:", result1);
                return resolve(result1);
            });
        });
    }
    const queryPromise2 = () => {
        const sql2 = `select o.order_id, o.customer_id, o.order_date_time, o.delivery_date_time, o.delivery_address,
        o.delivery_status,o.taxes, o.tip, o.instruction, o.total_amount, o.delivery_type, c.first_name , c.last_name, c.email, c.phone_number, c.profile_pic
        from orders as o Inner Join customers as c on o.customer_id = c.customer_id where o.res_id='${res_id}' order by order_date_time DESC;`;
        // const sql2 = `SELECT * from orders where customer_id='${customer_id}';`;
        console.log("sql2:", sql2);
        return new Promise((resolve, reject)=>{
            pool.query(sql2,  (error2, result2)=>{
                if(error2){
                    console.log("error2:", error2);
                    return reject(error2);
                }
                // console.log("result2:", result2); 
                return resolve(result2);
            });
        });
    };
    try {
        const result1 = await queryPromise1();
        const result2 = await queryPromise2();
        // console.log("result1[0]:", result1);
        let res_body = { data: result2};
        return res.status(200).json(res_body);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});


export default router;
