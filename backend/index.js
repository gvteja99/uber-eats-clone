import express from 'express';
import pool from "./pool.js";
import bcrypt from 'bcrypt';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import signup from "./routes/signup.js";
import login from "./routes/login.js";
import restaurants from "./routes/restaurants.js";
import customers from "./routes/customers.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());


app.use("/signup", signup);
app.use("/login", login);
app.use("/restaurants", restaurants);
app.use("/customers", customers);

const port = 3001;


// Use of another path to see results for js_refresher.js
app.get('/', (req, res) => {
    res.send("Hello World")
});

app.get('/test_api', async (req, res) => {
  await pool.query(`SELECT * from test_table`, async (error, results) => {
    if (error) {
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      res.end(error.code);
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(JSON.stringify(results));
    }
  })
})

// To listen to port 3001
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

export default app;