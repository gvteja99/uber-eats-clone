import { Strategy as JwtStrategy , ExtractJwt } from "passport-jwt";
import Customer from "../Models/customers.js";
import config from "../utils/config.js";

const { token_key } = config
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = token_key;

const usepassport =  (passport) => {
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    // console.log({ email: jwt_payload });
    // console.log("=========jwtpayload", jwt_payload);
    Customer.findOne({email: jwt_payload.email})
        .then((customer) => {
            // console.log("Customer", customer);
            if (customer) {
            return done(null, customer);
            }
            return done(null, false);
        })
        .catch((err) => {
            console.log(err);
        });
    }));
}

export default usepassport;