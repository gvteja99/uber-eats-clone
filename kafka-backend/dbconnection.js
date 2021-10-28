import mongoose from "mongoose";

//Mongo Connection
const connectMongoDB = async () => {
    const dbConnectionUrl =  'mongodb+srv://root:root12345@cluster0.gyxjb.mongodb.net/UberEats?retryWrites=true&w=majority';
    const options = {
    //   poolSize: 500,
      useNewUrlParser: true,
    //   useCreateIndex: true,
      useUnifiedTopology: true,
    //   useFindAndModify: false
    };

    try {
      await mongoose.connect(dbConnectionUrl, options);
      console.log("MongoDB connected");
    } catch (err) {
      console.log("Could not connect to MongoDB", err);
    }
  };
  
//   module.exports = connectMongoDB;
export default connectMongoDB;