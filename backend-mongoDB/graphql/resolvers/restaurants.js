import Restaurants, {Dish} from '../../Models/restaurants.js';
import mongoose from "mongoose";

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
    },
}

export default resolvers;