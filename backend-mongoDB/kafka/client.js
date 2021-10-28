// var rpc = new (require("./kafkarpc"))();
import kafkarpc from "./kafkarpc.js";

let rpc = new kafkarpc();

//make request to kafka
function make_request(queue_name, msg_payload, callback) {
  console.log("in make request");
  console.log(msg_payload);
  rpc.makeRequest(queue_name, msg_payload, function (error, response) {
    if (error) {
      callback(error, null);
    } else {
      console.log("response", response);
      callback(null, response);
    }
  });
}

export default {
  make_request,
}

// exports.make_request = make_request;
