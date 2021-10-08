import mysql, { createConnection } from "mysql";

// In createConnection method, We are creating a MySQL connection on every request coming from the user.
//  Soon after getting multiple concurrent requests, the MySQL server will get overloaded and throw an error.

// Connection Pooling is a mechanism to maintain a cache of database connection 
// so that the connection can be reused after releasing it.
// connection pooling helps to improve the performance of MySQL
// and not overload the MySQL server with too many connections.

const port = 3306;
// const connection = mysql.createConnection({
//     host: "database-1.caorc3vfgkkg.us-east-2.rds.amazonaws.com",
//     user: "admin",
//     password: "Password123",
//     database: "ubereats_db",
//     port,
//     // connectionLimit: 100,
// });

// connection.connect((err) => {
//     if (err) throw err;
//     console.log('Connected to MySQL Server!');
//   });

// export default connection;

const pool = mysql.createPool({
    host: "database-1.caorc3vfgkkg.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "Password123",
    port,
    database: "ubereats_db",
    // connectionLimit: 100,
});

pool.getConnection((err) => {
    if (err) {
        throw 'Error occured: ' + err;
    }
    console.log("pool created");
});

export default pool;
