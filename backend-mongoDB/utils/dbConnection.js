import mongoose from "mongoose";
import config  from "./config.js";

// console.log("===", config)
const { mongoDB } = config;

//Mongo Connection
const connectMongoDB = async () => {
    const options = {
    //   poolSize: 500,
      useNewUrlParser: true,
    //   useCreateIndex: true,
      useUnifiedTopology: true,
    //   useFindAndModify: false
    };

    try {
      await mongoose.connect(mongoDB, options);
      console.log("MongoDB connected");
    } catch (err) {
      console.log("Could not connect to MongoDB", err);
    }
  };
  
//   module.exports = connectMongoDB;
export default connectMongoDB;