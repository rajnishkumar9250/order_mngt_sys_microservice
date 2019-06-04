const kafka = require('kafka-node');
const bp = require('body-parser');
const config = require('./config');
const databaseRef = require('./db').databaseRef;
const repository = require('./repository/repository');


try {
  const Consumer = kafka.Consumer;
  const client = new kafka.KafkaClient({kafkaHost: config.kafkaSettings.kafka_server});
  var topicsToCreate = [{
      topic: config.kafkaSettings.kafka_topic,
      partitions: 1,
      replicationFactor: 1
    }];
 var consumer;
 client.createTopics(topicsToCreate, (error, result) => {
    if(error){
       console.log("Error: ", error);
    }else{
        consumer = new Consumer(client,
            [{ topic: config.kafkaSettings.kafka_topic, partition: 0 }],
            {
              autoCommit: true,
              fetchMaxWaitMs: 1000,
              fetchMaxBytes: 1024 * 1024,
              encoding: 'utf8',
              fromOffset: false
            });
        }
        consumer.on('ready', function() {
          console.log('consumer is ready');
        });

        consumer.on('connect', function() {
          console.log('consumer is connected');
        });

        consumer.on('message', async function(message) {
            console.log('message: ', message);
            console.log('kafka-> ',   message.value);
            var data = JSON.parse(message.value);
            var db = databaseRef();
            repository.connect(db).then(repo =>{
                repo.placeOrder(data.orderId);
            })
            if(data.type == "shippingorder"){
                console.log("shipping the order now");
            }
        });
        consumer.on('error', function(err) {
            console.log('error', err);
        });
 });
  

  
}
catch(e) {
  console.log(e);
}
