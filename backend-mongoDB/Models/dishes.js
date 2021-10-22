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
    res_id: {type: String, required: true}
},
{ 
    versionKey: false 
});

const Dish = mongoose.model("Dish", dishSchema);

export default Dish;
