// var connection =  new require('./kafka/Connection');
import mongoose from "mongoose";
import connection from './kafka/Connection.js';

//topics files
//var signin = require('./services/signin.js');
// var Books = require('./services/books.js');
import Books from './services/books.js';
import getRestaurants from './services/getRestaurants.js';
import connectMongoDB from "./dbconnection.js";

try {
    connectMongoDB();

    const db = mongoose.connection;
    db.on('error', (error) => console.log(error))
    db.once('open', () => console.log('Connected to Database'));
} catch(e) {
    console.log("error3", e);
}

function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    const consumer = connection.getConsumer(topic_name);
    const producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        const data = JSON.parse(message.value);
        
        fname.handle_request(data.data, function(err,res){
            console.log('after handle'+res);
            const payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
// handleTopicRequest("post_book",Books);
handleTopicRequest("getRestaurants", getRestaurants);
