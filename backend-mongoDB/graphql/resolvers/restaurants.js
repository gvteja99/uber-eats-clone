import Restaurants, {Dish} from '../../Models/restaurants.js';
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import config from "../../utils/config.js";

const resolvers = {
    Query: {
        async getRestaurants(parent, args) {
            try {
                const { customer_city='', search='' } =  args;
                let searchStringRegex  = new RegExp(search, "i");
                const resList = await Restaurants.find({ $or: [ {name: searchStringRegex}, {'address.city': searchStringRegex},  {'dishes.dish_name': searchStringRegex},  ] });
                return resList
            } catch(error) {
                console.log("error:", error);
                throw new Error(error)
            }
        }
    },
    Mutation: {
        async postDish(parent, args) {
            try {
                const { res_id, dish_name, dish_image, dish_price, description, main_ingredient, dish_category, food_type} = args.dish;
                const dishObj = new Dish({
                    dish_name, dish_image, dish_price, description, main_ingredient, dish_category, food_type, res_id
                });
                const r = await Restaurants.findById(res_id);
                r.dishes.push(dishObj);
                await r.save();
                return r;
                // return res.status(200).json({ data: r, dish: dishObj });
            } catch(error) {
                console.log(error);
                throw new Error(error)
                // return res.status(500).json(error);
            }
        },
        async updateDish(parent, args) {
            try {
                const { res_id, _id, dish_name, dish_image, dish_price, description, main_ingredient, dish_category, food_type} = args.dish;
                const update = {
                    dish_name, dish_image, dish_price, description, main_ingredient, dish_category, food_type
                }
                const r = await Restaurants.findById(res_id);
                let dish = r.dishes.id(mongoose.Types.ObjectId(_id));
                dish.set({...update});
                let result = await r.save();
                return result
            } catch(error) {
                console.log(error);
                throw new Error(error);
            }
        },
        async restaurantLogin(_, { loginInput }) {
            const { email, password } = loginInput;
            try {
                const restaurant = await Restaurants.findOne({email})
                if (!restaurant) {
                    throw new Error("Invalid email");
                }
                const match = await bcrypt.compare(password, restaurant.password);
                if (!match) {
                    throw new Error("Invalid password");
                }
                const token = jwt.sign({ email}, config.token_key, {expiresIn: "2h"});
                restaurant.token = token;
                await restaurant.save();
                return restaurant;
            } catch(error) {
                console.log("======inside catch:");
                console.log("error==", error);
                throw new Error(error);
            }
        },
        async restaurantLogout(_, { logoutInput }) {
            const { email } = logoutInput;
            try {
                await Restaurants.updateOne({email}, {token: ''});
                return;
            } catch(error) {
                console.log("error==", error);
                throw new Error(error);
            }
        },
        async restaurantSignup(_, { restaurantSignupInput }) {
            try {
                const { 
                    email, password, name, city, street_address='', apt_number='', state, country, zipcode=null
                } = restaurantSignupInput;
        
                const existingUser =  await Restaurants.findOne({email: email});
                if (existingUser) {
                    throw new Error("Restaurant with given email already exist")
                }
                await bcrypt.hash(password, 10, async function(err, hash) {
                    const resBody = new Restaurants({
                        name,
                        email,
                        password: hash,
                        phone_number: '',
                        description: '',
                        timing_open: '',
                        timing_close: '',
                        token: '',
                        address: {
                            street_address,
                            apt_number,
                            city,
                            state,
                            country,
                            zipcode,
                        },
                        dishes: []
                    });
                    const r = await resBody.save();
                    // return;
                });
            } catch(error) {
                console.log("error==", error);
                throw new Error(error);
            }
        }
    },
}

export default resolvers;