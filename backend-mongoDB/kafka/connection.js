// var kafka = require("kafka-node");
import kafka from "kafka-node";
function ConnectionProvider() {
  this.getConsumer = function (topic_name) {
    // if (!this.kafkaConsumerConnection) {

    // this.client = new kafka.KafkaClient(`localhost:2181`);
    this.client = new kafka.KafkaClient(`localhost:9092`);

    // this.client = new kafka.KafkaClient({ kafkaHost: "<KafkaBroker/Zookeeper Public IP of EC2>:2181" });


    //this.client = new kafka.Client("localhost:2181");
    /*this.client.refreshMetadata([{topic: topic_name}], (err) => {
                if (err) {
                    console.warn('Error refreshing kafka metadata', err);
                }
            });*/
    this.kafkaConsumerConnection = new kafka.Consumer(this.client, [
      { topic: topic_name, partition: 0 }
    ]);
    this.client.on("ready", function () {
      console.log("client ready!");
    });
    // }
    return this.kafkaConsumerConnection;
  };

  //Code will be executed when we start Producer
  this.getProducer = function () {
    if (!this.kafkaProducerConnection) {
      // this.client = new kafka.KafkaClient(`localhost:2181`);
      this.client = new kafka.KafkaClient(`localhost:9092`);

      /*this.client.refreshMetadata([{topic: topic_name}], (err) => {
                if (err) {
                    console.warn('Error refreshing kafka metadata', err);
                }
            });*/
      var HighLevelProducer = kafka.HighLevelProducer;
      this.kafkaProducerConnection = new HighLevelProducer(this.client);
      //this.kafkaConnection = new kafka.Producer(this.client);
      console.log("producer ready");
    }
    return this.kafkaProducerConnection;
  };
}
export default new ConnectionProvider();
// exports = module.exports = new ConnectionProvider();
