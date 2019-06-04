const express = require('express');
const router = express.Router();
const request = require('request-promise-native');
var baseUrl = "http://ordermgt-product:3000/product";

router.get('/', async (req, res) => {
  //const userId = req.session.userId
  const uri = baseUrl+`/1`;
  const user = await request(uri);
  res.json(user);
});

router.post('/add',  async  function(req, res, next) {
    console.log('adding a product', req.body);
    //const uri = `http://localhost:3000/product/add`
    var options = {
        method: 'POST',
        uri: baseUrl+'/add',
        body: req.body,
        json: true // Automatically stringifies the body to JSON
    };

    const prod = await request(options);
    res.json(prod);
});



module.exports = router;