const kafka = require('kafka-node');
const bp = require('body-parser');
const config = require('./config');

var producer;
const start = function(eventEmitter){
    try {
      const Producer = kafka.Producer;
      //const client = new kafka.KafkaClient(config.kafka_server);
      const client = new kafka.KafkaClient({kafkaHost: config.kafka_server});
      producer = new Producer(client);
      //const kafka_topic = 'example';
      console.log(config.kafka_topic);
      let payloads = [
        {
          topic: config.kafka_topic,
          messages: config.kafka_topic
        }
      ];

      producer.on('ready', async function() {
        console.log("kafka producer is ready now");
        eventEmitter.emit('kafka_producer_ready');  
      });

      producer.on('error', function(err) {
        console.log(err);
        console.log('[kafka-producer -> '+config.kafka_topic+']: connection errored');
        throw err;
      });
    }
    catch(e) {
      console.log(e);
    }
}

const sendMessage = function(data){
    data = JSON.stringify(data);
    let payloads = [
        {
          topic: config.kafka_topic,
          messages: data
        }
      ];
    let push_status = producer.send(payloads, (err, data) => {
      if (err) {
        console.log("kafka error: ", err);
        console.log('[kafka-producer -> '+config.kafka_topic+']: broker update failed');
      } else {
        console.log('[kafka-producer -> '+config.kafka_topic+']: broker update success');
      }
    });
}
    

module.exports = Object.assign({}, {start}, {sendMessage});
