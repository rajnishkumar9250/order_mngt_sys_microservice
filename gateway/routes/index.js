const express = require('express');
const router = express.Router();
const request = require('request-promise-native');

router.get('/', function(req, res, next){
   console.log("gateway default api");
   return res.redirect('/api-docs');
});

module.exports = router;