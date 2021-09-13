import express from 'express';
import pool from "./pool.js";

const app = express();
const port = 3000;


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

// To listen to port 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});