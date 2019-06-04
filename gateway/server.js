const express = require('express');
const request = require('request-promise-native');
const app = express();
const kafkaPublish = require('./kafkaProducer');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const bodyParser = require('body-parser');
const morgan = require('morgan');


const indexRouter = require('./routes/index');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(morgan('dev'));
app.use(bodyParser.json());  
app.use('/', indexRouter);
app.use('/v1/product', productRouter);
app.use('/v1/order', orderRouter);
// Resolve: GET /users/me
/*app.get('/users/me', async (req, res) => {
  //const userId = req.session.userId
  const uri = `http://localhost:3000/product/1`
  const user = await request(uri);
  res.json(user);
});*/

eventEmitter.on('kafka_producer_ready', function(){
   app.listen('8080'); 
   console.log("gateway is listening on localhost:8080");
});

kafkaPublish.start(eventEmitter);

