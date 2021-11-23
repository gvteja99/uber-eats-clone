import express from "express";
// import pool from "../pool.js";
import auth from "../middleware/auth.js";
import passport from "passport";
import Customers from "../Models/customers.js";
import Restaurants from "../Models/restaurants.js";
import Orders from "../Models/orders.js";
import multer from "multer";
import { fileURLToPath } from 'url';
import  path, {dirname} from "path";
import fs from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//get customer profile:
// auth,
router.get('/:id/profile',
    // passport.authenticate("jwt", { session: false }),
    async (req, res) => {
    try {
        const customer_id = req.params.id;
        const c = await Customers.findById(customer_id);
        return res.status(200).json(c);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});


//Update customer profile:
router.put('/profile',
    // passport.authenticate("jwt", { session: false }),
    async (req, res) => {
    try {
        const { customer_id, address_id, email, first_name, last_name, phone_number, dob, nickname, profile_pic, about,
            street_address, apt_number, city,  state, country, zipcode } = req.body;    
        const update = {
            email, first_name, last_name, phone_number, dob, nickname, profile_pic, about,
            address: {
                street_address,
                apt_number,
                city,
                state,
                country,
                zipcode,
            }
        }
        const result = await Customers.findByIdAndUpdate(customer_id, update, { new:true });
        return res.status(200).json(result);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.get('/:id/favourites',
    // passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const customer_id = req.params.id;
        // console.log("req====", req.user);
        // customer = req.user
        try {
            let customer = await Customers.findById(customer_id);
            if (!customer) {
                return res.status(400).send("Customer not found");
            }
            const restaurantIds = customer.favourites.toObject();
            const favourites = await Restaurants.find({_id: {$in: restaurantIds}});
            return res.status(200).json({data: favourites});
        } catch(error) {
            console.log(error);
            return res.status(500).json(error);
        }
});

router.post('/favourites', async (req, res) => {
    const { customer_id, res_id }= req.body;
    console.log("req.body", req.body)
    try {
        let customer = await Customers.findById( customer_id );
        if (!customer) {
            return res.status(400).send("Customer not found");
        }
        const index = customer.favourites.findIndex(item =>  item && item.toString() === res_id);
        if (index !== -1) {
            return res.status(400).send("Restaurant Already present in favourites");
        }
        customer.favourites.push(res_id);
        let updatedCustomer = await customer.save()
        return res.status(200).json({data: updatedCustomer});
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.delete('/:id/favourites/:res_id',
    //  passport.authenticate("jwt", { session: false }),
    async (req, res) => {
    const customer_id = req.params.id;
    const res_id = req.params.res_id;
    try {
        let customer = await Customers.findById(customer_id);
        const idx = customer.favourites.findIndex(item => item && item.toString() === res_id);
        if (idx !== -1) {
            customer.favourites.splice(idx, 1);
        } else {
            return res.status(400).send("Res is not in favourites");
        }
        customer = await customer.save();
        const restaurantIds = customer.favourites.toObject();
        const favourites = await Restaurants.find({_id: {$in: restaurantIds}});
        return res.status(200).json({data: favourites});
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

// router.get('/:id/delivery_address', async (req, res) => {
//     const customer_id = req.params.id;
//     const queryPromise1 = () => {
//         const sql1 = `select * from delivery_addresses where customer_id='${customer_id}';`;
//         console.log("sql1:", sql1);
//         return new Promise((resolve, reject)=>{
//             pool.query(sql1,  (error1, result1)=>{
//                 if(error1){
//                     console.log("error1:", error1);
//                     return reject(error1);
//                 }
//                 console.log("result1:", result1);
//                 return resolve(result1);
//             });
//         });
//     };
//     try {
//         const result1 = await queryPromise1();
//         console.log("result1[0]:", result1);
//         let res_body = { data: result1};
//         return res.status(200).json(res_body);
//     } catch(error) {
//         console.log(error);
//         return res.status(500).json(error);
//     }
// });

// auth
router.post('/delivery_address',
// passport.authenticate("jwt", { session: false }),
 async (req, res) => {
    const  { customer_id, delivery_address } = req.body;
    try {
        let c = await Customers.findById(customer_id);
        c.delivery_addresses.push({delivery_address});
        c = await c.save();
        return res.status(200).json({data: c})
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

//TODO:
router.get('/:id/orders',
//  passport.authenticate("jwt", { session: false }),
    async (req, res) => {
    try {
        const customer_id = req.params.id;
        let page = req.query.page || 1;
        let pageSize = req.query.pageSize || 5;
        let orders = await Orders.find({customer_id})
        let pageMax = Math.ceil(orders.length / pageSize);
            if (page > pageMax) {
                page = pageMax;
            }
            let start = (page - 1) * pageSize;
            let end = page * pageSize;
            orders = orders.slice(start,end);
            return res.status(200).json({data: orders, page, pageSize});
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.post('/orders',
    //  passport.authenticate("jwt", { session: false }),
    async (req, res) => {
    try {
        const { customer_id, first_name, last_name, cart, delivery_type, delivery_address, order_date_time, total_amount, delivery_fee, taxes, instruction, tip }= req.body;
        // For single Rest order place:
        let cartList = cart?.length > 0 && cart[0]
        let order_items = [];
        cartList?.dishes.map(dish => {
            order_items.push({
                res_id: dish.res_id,
                res_menu_id: dish.res_menu_id,
                dish_name: dish.dish_name,
                description: dish.description,
                quantity: dish.quantity,
                dish_price: dish.dish_price, 
                dish_category: dish.dish_category,
                food_type: dish.food_type,
            })
        })

        let orderPayload = {
            res_id: cartList._id,
            res_name: cartList.name,
            customer_id,
            first_name,
            last_name,
            order_date_time,
            delivery_type,
            delivery_address,
            delivery_fee,
            taxes,
            tip,
            instruction,
            total_amount,
            order_items,
        }

        const order = new Orders({...orderPayload}); 
        const savedOrder = await order.save()
        return res.status(200).json(savedOrder);
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

export default router;