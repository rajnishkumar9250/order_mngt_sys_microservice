const MongoClient = require('mongodb').MongoClient;

// here we create the url connection string that the driver needs
const getMongoURL = (options) => {
  const url = options.servers
    .reduce((prev, cur) => prev + `${cur.ip}:${cur.port},`, 'mongodb://')

  return `${url.substr(0, url.length - 1)}/${options.db}`
}


// mongoDB function to connect, open and authenticate
const connect = (options, mediator) => {
  mediator.once('boot.ready', () => {
    MongoClient.connect( options.url, (err, db) => {
        if (err) {
          mediator.emit('db.error', err);
        }
        mediator.emit('db.ready', db);
    });
  });
}

module.exports = Object.assign({}, {connect})
