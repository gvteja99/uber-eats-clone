import jwt from "jsonwebtoken";
import config from "../utils/config.js";
import alert from "alert"

const verifyToken = (req, res, next) => {
    const token = 
    req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["Authorization"];

    if (!token) {
        alert("Unauthorized Error\n sign in to get access");
        return res.status(401).end("Sign in to access");
    }
    try {
        const decoded = jwt.verify(token, config.token_key);
        req.user = decoded;
    } catch (err) {
        alert("Invalid Authentication: Your session is expired");
        return res.status(401).send("Invalid Token");
    }
    return next();
}

export default verifyToken;