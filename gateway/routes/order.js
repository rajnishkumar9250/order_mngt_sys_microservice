const express = require('express');
const router = express.Router();
const request = require('request-promise-native');
const kafkaProducer = require('./../kafkaProducer');
const pdf = require('html-pdf')



var baseUrl = "http://ordermgt-order:3001/order";

router.get('/', async (req, res) => {
  //const userId = req.session.userId
  const uri = `{baseUrl}/1`
  const user = await request(uri);
  res.json(user);
});

router.post('/create',  async  function(req, res, next) {
    console.log('creating an order', req.body);
    //const uri = `http://localhost:3000/product/add`
    var options = {
        method: 'POST',
        uri: baseUrl+'/create',
        body: req.body,
        json: true // Automatically stringifies the body to JSON
    };
    var orderDet;
    try {
        orderDet = await request(options);    
    }catch(err){
        return res.json({status: false, message: err.message});
    }
    
    console.log("order details: ", orderDet);
    var html = '<div class="header" style="height:100px;"><div style="width:30%;float:left;"><div style="width: 50%; margin-left: 10%;border: solid 1px black;margin-top: 15%;"><span>Company Logo</span></div></div><div style="width:30%;float:left;"><h2>Order Management System</h2></div><div style="width:30%;float:left;"><h2 style="margin-left:10px;">Invoice</h2></div></div><div class="body"><div class="shippingAddress" style="width:45%;float:left;"><span>'+orderDet.address.firstName +'  '+ orderDet.address.lastName+' ,</span><br/><span>'+orderDet.address.address+'</span><br/><span>Mobile: '+orderDet.address.phone+'</span><br/><span>Email: '+orderDet.address.email+'</span></div><div class="productDetails" style="width:50%;float:left;margin-left: 2%;"><h4>OrderId: '+orderDet.order.insertedIds[0]+' </h4><h4>Item Name:  '+orderDet.productInfo.name+'</h4><h4>Quantity: '+orderDet.quantity+'</h4><h4>Total: '+orderDet.totalPrice+'</h4></div></div>';
    //res.json(orderDet);
    pdf.create(html).toBuffer(function(err, buffer){
      console.log('This is a buffer:', Buffer.isBuffer(buffer));
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=some_file.pdf',
        'Content-Length': buffer.length
       });
       res.end(buffer);
    });
});

router.post('/shippedorder', function(req, res, next){
    console.log("shipping the order", req.body);
    var data = {type:"shippingorder", orderId: req.body.orderId};
    kafkaProducer.sendMessage(data);
    res.json({status:true, message:"success"});
});

router.post("/generateInvoice", function(req, res){
    var html = "<h2>Hello World</h2>";
    pdf.create(html).toBuffer(function(err, buffer){
      console.log('This is a buffer:', Buffer.isBuffer(buffer));
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=some_file.pdf',
        'Content-Length': buffer.length
       });
       res.end(buffer);
    });
});


module.exports = router;