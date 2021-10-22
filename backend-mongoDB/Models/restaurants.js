import mongoose from "mongoose";

const Schema = mongoose.Schema;

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
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dish"
    }]
},
{ 
    versionKey: false 
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
