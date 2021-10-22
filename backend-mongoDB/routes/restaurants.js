import express from "express";
import auth from "../middleware/auth.js";
import Restaurants from "../Models/restaurants.js";
const router = express.Router();


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
        // TODO: Search and customer city sort option
        const resList = await Restaurants.find({});
        console.log("resList", resList);
         return res.status(200).json({data: resList});
    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

//Update restaurant profile:
// TODO: auth
router.put('/profile',  async (req, res) => {
    // address_id
    const { res_id, name, delivery_option, phone_number, description, timing_open, timing_close, street_address,
        apt_number, city,  state, country, zipcode} = req.body;
    try {
        const update = {
            name, delivery_option, phone_number,description, timing_open, timing_close,
            address: {
                street_address,
                apt_number,
                city,
                state,
                country,
                zipcode,
            }
        }
        const result = await Restaurants.findByIdAndUpdate(res_id, update, { new:true });
        res.status(200).json(result);

    } catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
});


export default router;