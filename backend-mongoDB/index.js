import express from 'express';
// import pool from "./pool.js";
// import bcrypt from 'bcrypt';
// import session from 'express-session';
import cookieParser from 'cookie-parser';
import mongoose from "mongoose";
import cors from 'cors';
import {ApolloServer, gql} from 'apollo-server-express';
import connectMongoDB from './utils/dbConnection.js';
// import config from "./utils/config.js";
import signup from "./routes/signup.js";
import login from "./routes/login.js";
import restaurants from "./routes/restaurants.js";
import customers from "./routes/customers.js";
import logout from './routes/logout.js';
import imageUpload from './routes/imageUpload.js';
import passport from "passport";
import usepassport from './middleware/passport.js';
import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers/index.js";

// Construct a schema, using GraphQL schema language
// const typeDefs = gql`
//   type Query {
//     hello: String
//   }
// `;

// Provide resolver functions for your schema fields
// const resolvers = {
//   Query: {
//     hello: () => 'Hello world!',
//     getRestaurants: () => {},
//   },
// };

const server = new ApolloServer({
    playground: true,
    typeDefs, resolvers });

// Added this line
await server.start();

const app = express();
// const {mongoDB} = config
server.applyMiddleware({app});

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use("/signup", signup);
app.use("/restaurants", restaurants);

//Passport midlleware
app.use(passport.initialize());

//passport config
usepassport(passport);

app.use("/login", login);
app.use("/customers", customers);
app.use("/logout", logout);
app.use("", imageUpload);

const port = 3002;


// Use of another path to see results for js_refresher.js
app.get('/', (req, res) => {
    res.send("Hello World")
});

connectMongoDB();

const db = mongoose.connection;
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'));


// To listen to port 3002
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

export default app;