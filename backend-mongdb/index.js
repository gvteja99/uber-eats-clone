import express from 'express';
// import pool from "./pool.js";
// import bcrypt from 'bcrypt';
// import session from 'express-session';
import cookieParser from 'cookie-parser';
import mongoose from "mongoose";
import cors from 'cors';
import connectMongoDB from './utils/dbConnection.js';
// import config from "./utils/config.js";
import signup from "./routes/signup.js";
// import login from "./routes/login.js";
// import restaurants from "./routes/restaurants.js";
// import customers from "./routes/customers.js";
// import logout from './routes/logout.js';

const app = express();
// const {mongoDB} = config

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


app.use("/signup", signup);
// app.use("/login", login);
// app.use("/restaurants", restaurants);
// app.use("/customers", customers);
// app.use("/logout", logout);

const port = 3001;


// Use of another path to see results for js_refresher.js
app.get('/', (req, res) => {
    res.send("Hello World")
});

// app.get('/test_api', async (req, res) => {
//   await pool.query(`SELECT * from test_table`, async (error, results) => {
//     if (error) {
//       res.writeHead(200, {
//         'Content-Type': 'text/plain',
//       });
//       res.end(error.code);
//     } else {
//       res.writeHead(200, {
//         'Content-Type': 'text/plain'
//       });
//       res.end(JSON.stringify(results));
//     }
//   })
// })
// const options = {
//     userNewUrlParser: true,
//     userUnifiedTopology: true,
//     poolsize: 500,
//     bufferMaxEntries: 0,
// }

// mongoose.connect(mongoDB, options, (err, res) => {
//     if (err) {
//         console.log(err);
//         console.log('Mongodb Connection Failed');
//     } else {
//         console.log('MongoDB Connected');
//     }
// })
// mongoose.connect(mongoDB);
// Mongodb connection
connectMongoDB();

const db = mongoose.connection;
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'));

// To listen to port 3001
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

export default app;