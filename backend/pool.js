import mysql from "mysql";

const port = 3306;
const pool = mysql.createPool({
    host: "database-1.caorc3vfgkkg.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "zerosehero123",
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
