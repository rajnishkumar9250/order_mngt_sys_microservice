// simple configuration file

// database parameters
const dbSettings = {
  db: process.env.DB || 'orders',
  user: process.env.DB_USER || 'cristian',
  pass: process.env.DB_PASS || 'cristianPassword2017',
  repl: process.env.DB_REPLS || 'rs1',
  servers: (process.env.DB_SERVERS) ? process.env.DB_SERVERS.split(' ') : [
    'localhost:27017'
  ],
  url : "mongodb://ordermgt-mongo:27017/orders",
  dbParameters: () => ({
    w: 'majority',
    wtimeout: 10000,
    j: true,
    readPreference: 'ReadPreference.SECONDARY_PREFERRED',
    native_parser: false
  }),
  serverParameters: () => ({
    autoReconnect: true,
    poolSize: 10,
    socketoptions: {
      keepAlive: 300,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000
    }
  }),
  replsetParameters: (replset = 'rs1') => ({
    replicaSet: replset,
    ha: true,
    haInterval: 10000,
    poolSize: 10,
    socketoptions: {
      keepAlive: 300,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000
    }
  })
}

const kafkaSettings = {
  kafka_topic: 'example',
  kafka_server: 'ordermgt-kafka-broker:9092'
};

// server parameters
const serverSettings = {
  port: process.env.PORT || 3001
}

module.exports = Object.assign({}, { dbSettings, serverSettings, kafkaSettings })
