import jwt from "jsonwebtoken";
import config from "../config.js";

const verifyToken = (req, res, next) => {
    const token = 
    req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(401).json("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, config.token_key);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
}

export default verifyToken;