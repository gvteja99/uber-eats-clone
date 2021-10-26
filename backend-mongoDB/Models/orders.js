import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
    res_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    },
    res_menu_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dish"
    },
    dish_name: String,
    description: String,
    quantity: { type: Number, default: 1 },
    dish_price: { type: Number }, 
    dish_category: {type: String, required: true},
    food_type: {type: Number},

},
{ 
    versionKey: false 
});

const orderSchema = new Schema({
    res_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    },
    res_name: String,
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    },
    order_date_time: { type: String, required: true},
    delivery_type: { type: Number, default: 1},
    delivery_date_time: { type: String},
    delivery_address: { type: String},
    delivery_status: { type: Number, default: 1},
    delivery_fee: { type: Number, default: 0},
    taxes: { type: Number, default: 0},
    tip: { type: Number, default: 0},
    instruction: { type: String},
    total_amount: { type: Number, default: 0},
    order_items: [orderItemSchema]
},
{ 
    versionKey: false 
});

const Order = mongoose.model("Order", orderSchema);
export const OrderItem = mongoose.model("OrderItem", orderItemSchema);

export default Order;

