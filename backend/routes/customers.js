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
        const sql3 = `select c.customer_id, c.customer_address_id, c.email, c.first_name, c.last_name, c.phone_number, c.dob, c.nickname, c.profile_pic, c.about,
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

router.get('/:id/orders', async (req, res) => {
    const customer_id = req.params.id;
    const queryPromise1 = () => {
        const sql1 = `select o.order_id, o.res_id, o.order_date_time, o.delivery_date_time, o.delivery_address,
        o.delivery_status,o.taxes, o.tip, o.instruction, o.total_amount, o.delivery_type, r.name as res_name
        from orders as o Inner Join restaurants as r on o.res_id = r.res_id where o.customer_id='${customer_id}' order by order_date_time DESC;`;
        // const sql1 = `SELECT * from orders where customer_id='${customer_id}';`;
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
            // return res.status(400).json("Empty List");
        }
        console.log("result1[0]:", result1);
        let res_body = { data: result1};
        return res.status(200).json(res_body);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.get('/:id/delivery_address', async (req, res) => {
    const customer_id = req.params.id;
    const queryPromise1 = () => {
        const sql1 = `select * from delivery_addresses where customer_id='${customer_id}';`;
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
        console.log("result1[0]:", result1);
        let res_body = { data: result1};
        return res.status(200).json(res_body);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.post('/delivery_address', async (req, res) => {
    const  { customer_id, delivery_address } = req.body;
    const queryPromise1 = () => {
        const sql1 = `INSERT INTO delivery_addresses (customer_id, delivery_address)
        VALUES ('${customer_id}', '${delivery_address}');;`;
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
        const sql2 = `select * from delivery_addresses where customer_id='${customer_id}';`;
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
        const result1 = await queryPromise1();
        const result2 = await queryPromise2();
        console.log("result1[0]:", result1);
        let res_body = { data: result2 };
        return res.status(200).json(res_body);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.post('/orders', async (req, res) => {
    const { customer_id, cart, delivery_type, delivery_address, order_date_time, total_amount, delivery_fee, taxes, instruction, tip }= req.body;
    // for (const order of cart) {
    //     // insert order into the orders table
    //     for ( const orderItem of cart) {
    //         //insert into order Items table
    //     }
    // }
    const queryPromise1 = (order) => {
        // const sql1 = `SELECT * from orders where customer_id='${customer_id}';`;
        const { res_id } = order;
        const sql1 = `INSERT INTO orders (res_id, customer_id, order_date_time, delivery_type, delivery_address, total_amount, delivery_fee, taxes, instruction, tip)
        VALUES ('${res_id}', '${customer_id}', '${order_date_time}', '${delivery_type}', '${delivery_address}',
         '${total_amount}', ${delivery_fee}, '${taxes}', '${instruction}', ${tip});`
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
    const queryPromise2 = (orderItem, order_id) => {
        const {dish_name, dish_price, quantity, res_menu_id } = orderItem
        const sql2 = `INSERT INTO order_items (order_id, res_menu_id, dish_name, dish_price, quantity)
        VALUES ('${order_id}', '${res_menu_id}', '${dish_name}', '${dish_price}', '${quantity}');`
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
        for (const order of cart) {
            console.log("===========1", order)
            const result1 = await queryPromise1(order);
            // insert order into the orders table
            for ( const orderItem of order.dishes) {
                //insert into order Items table
                const result2 = await queryPromise2(orderItem,result1.insertId);
            }
        }
        // const result1 = await queryPromise1();
        // if (!(result1 && result1.length > 0)) {
        //     // return res.status(400).json("Empty List");
        // }
        // console.log("result1[0]:", result1);
        // let res_body = { data: result1};
        return res.status(200).json("Order Placed");
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.get('/order/:id', async (req, res) => {
    const order_id = req.params.id;
    // for (const order of cart) {
    //     // insert order into the orders table
    //     for ( const orderItem of cart) {
    //         //insert into order Items table
    //     }
    // }
    const queryPromise1 = () => {
        const sql1 = `select order_item_id, res_menu_id, quantity, dish_price, dish_name from order_items where order_id = '${order_id}'; `
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
        // const result1 = await queryPromise1();
        // if (!(result1 && result1.length > 0)) {
        //     // return res.status(400).json("Empty List");
        // }
        console.log("result1[0]:", result1);
        let res_body = { data: result1};
        return res.status(200).json(res_body);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.post('/favourites', async (req, res) => {
    const { customer_id, res_id }= req.body;
    const queryPromise1 = () => {
        const sql1 = `Select * from favourites where customer_id = '${customer_id}' and res_id = '${res_id}';`
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
        const sql2 = `INSERT INTO favourites (customer_id, res_id) VALUES ('${customer_id}', '${res_id}');`
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
    const queryPromise3 = () => {
        const sql3 = `select f.favourite_id, f.customer_id, f.res_id, r.email, r.address_id, r.name, r.phone_number, r.delivery_option, r.description, r.timing_open, r.timing_close,
        a.street_address, a.apt_number, a.city, a.state, a.country, a.zipcode
        from restaurants as r INNER JOIN addresses as a ON r.address_id = a.address_id INNER JOIN favourites as f ON r.res_id = f.res_id  where customer_id = '${customer_id}';`
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
            return res.status(400).json("Already present in favourites");
        }
        const result2 = await queryPromise2();
        const result3 = await queryPromise3();
        return res.status(200).json(Object.assign({data: result3 }));
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.get('/:id/favourites', async (req, res) => {
    const customer_id = req.params.id;
    const queryPromise1 = () => {
        const sql1 = `select f.favourite_id, f.customer_id, f.res_id, r.email, r.address_id, r.name, r.phone_number, r.delivery_option, r.description, r.timing_open, r.timing_close,
        a.street_address, a.apt_number, a.city, a.state, a.country, a.zipcode
        from restaurants as r INNER JOIN addresses as a ON r.address_id = a.address_id INNER JOIN favourites as f ON r.res_id = f.res_id  where customer_id = '${customer_id}';`
        // const sql1 = `Select * from favourites where customer_id = '${customer_id}';`
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
        // if (result1 && result1.length > 0) {
        //     return res.status(400).json("Already present in favourites");
        // }
        return res.status(200).json({ data: result1 });
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.delete('/favourites/:id', async (req, res) => {
    const favourite_id = req.params.id;
    const queryPromise1 = () => {
        const sql1 = `DELETE from favourites where favourite_id = '${favourite_id}';`
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
        return res.status(200).json("Restaurant is removed from favourites");
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

export default router;
