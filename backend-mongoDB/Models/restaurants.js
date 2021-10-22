import mongoose from "mongoose";

const Schema = mongoose.Schema;

const dishSchema = new Schema({
    dish_name: { type: String, required: true, trim: true },
    dish_image: String,
    dish_price: { type: Number, required: true, trim: true },
    description: String,
    main_ingredient: String,
    dish_category: { type: String, required: true, trim: true , default: 'appetizer'},
    food_type: {type: Number, required: true, default: 1},
    res_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    }
},
{ 
    versionKey: false 
});

const restaurantSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    delivery_option: { type: Number, default: 1},
    phone_number: String,
    description: String,
    timing_open: String,
    timing_close: String,
    token: {type: String, default: ''},
    address: {
        street_address: String,
        apt_number: String,
        city: String,
        state: String,
        country: String,
        zipcode: Number,
    },
    dishes: [dishSchema]
},
{ 
    versionKey: false 
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export const Dish = mongoose.model("Dish", dishSchema);

export default Restaurant;

