import mongoose from "mongoose";

const Schema = mongoose.Schema;

const customerSchema = new Schema({
    // _id: Number,
    // customer_id: { type: String, required: true, trim: true },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    phone_number: { type: String, trim: true },
    dob: { type: String, trim: true },
    nickname: { type: String, trim: true },
    profile_pic: { type: String, trim: true },
    about: { type: String, trim: true },
    token: {type: String, default: ''},
    // customer_address_id: { type: String, trim: true },
    address: {
        street_address: String,
        apt_number: String,
        city: String,
        state: String,
        country: String,
        zipcode: Number,
    },
    //TODO:
    favourites:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    }],
},
{ 
    versionKey: false 
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
