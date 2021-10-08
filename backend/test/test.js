// import assert from 'assert';
import chai from 'chai';
import chaiHttp from 'chai-http'
import app from '../index.js';

const assert = chai.assert;
chai.use(chaiHttp);
const expect = chai.expect;
const agent = chai.request.agent(app);

// describe('Array', function() {
//   describe('#indexOf()', function() {
//     it('should return -1 when the value is not present', function() {
//       assert.equal([1, 2, 3].indexOf(4), -1);
//     });
//   });
// });

describe('Restaurant Login Test', function () {

    it('Invalid Restaurant Email',() => {
        agent.post("/login/restaurant")
            .send({ email: "res100@spartan.com", password: "password" })
            .then(function (res) {
                expect(JSON.parse(res.text).error).to.equal("Invalid credentials");
            })
            .catch(error => {
                console.log(error);
            });
    });
    it('Invalid Restaurant Password',() => {
        agent.post("/login/restaurant")
            .send({ email: "res2@gmail.com", password: "password" })
            .then(function (res) {
                expect(JSON.parse(res.text).error).to.equal("Invalid password");
            })
            .catch(error => {
                console.log(error);
            });
    });
});

describe('Customer Signup Test', function () {

    it('Invalid Restaurant Email',() => {
        agent.post("/signup/customer")
            .send({
                email: "c7@gmail.com",
                password: "12345",
                first_name: "cccc",
                last_name: "3"
            })
            .then(function (res) {
                expect(res.text).to.equal("Email should be unique");
            })
            .catch(error => {
                console.log(error);
            });
    });
});

describe('Get Restaurant list', function () {
    it('Successful Get Res List',() => {
        agent.get("/restaurants")
            .then(function (res) {
                expect(res.status).to.equal(200);
            })
            .catch(error => {
                console.log(error);
            });
    });
});

describe('Customer Delivery Address Test', function () {

    it('Authentication Error Test',() => {
        agent.post("/customers/delivery_address")
            .send({
                "customer_id": 22,
                "delivery_address": "san franando, 108, sanjose,95112, ca, us"
            })
            .then(function (res) {
                expect(res.text).to.equal("Sign in to access");
            })
            .catch(error => {
                console.log(error);
            });
    });
});

describe('GET Restaurant Dish Test', function () {

    it('Success Res Dish Test',() => {
        agent.get("/restaurants/14563/dishes")
            .then(function (res) {
                expect(res.status).to.equal(200);
            })
            .catch(error => {
                console.log(error);
            });
    });
});