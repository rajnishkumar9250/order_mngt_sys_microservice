const status = require('http-status')
const request = require('request');

function getProductDetail(productId){
    const options = {  
        url: 'http://ordermgt-product:3000/product/'+productId,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
            'User-Agent': 'my-reddit-client'
        }
    };
    return new Promise(function(resolve, reject){
        request(options, function(err, res, body) {              
            if(err){
               return reject(err);
            }
            let json = JSON.parse(body);
            console.log("product dets in order: ", json);
            resolve(json);
        });
    });
}

function updateProductQty(productId, dataToUpdate){
     var options = {
        method: 'PUT',
        uri: 'http://ordermgt-product:3000/product/'+productId,
        body: dataToUpdate,
        json: true // Automatically stringifies the body to JSON
    };
     return new Promise(function(resolve, reject){
        request(options, function(err, res, body) {              
            if(err){
               return reject(err);
            }
            console.log("update prod: ", body);
            resolve(body);
        });
    });
}

module.exports = (app, options) => {
  console.log("options: ", options);
  const {repo} = options
  
  
  app.post('/order/create', async function(req, res, next){
     console.log("body: ", req.body);
     var orderInfo = req.body;
     if(!orderInfo.productId){
         return res.status(405).json({status: false, message: "productId can not be empty"});
     }
     if(orderInfo.quantity < 0){
         return res.status(405).json({status: false, message: "quantity can not be negative number"});
     }
       
      try{
          var productInfo = await getProductDetail(orderInfo.productId);
          if(!productInfo){
            return res.status(405).json({status:false, message:" Invalid productId"});
          }
          if(productInfo.quantity < orderInfo.quantity){
            return res.status(405).json({status:false, message:"Only "+productInfo.quantity+" item is available Now."});
          }
          orderInfo.productInfo = productInfo;    
      }catch(err){
          return res.status(500).json({status: false, message: err.message});
      }
      
      try{
          var order = await repo.createOrder(orderInfo);
          orderInfo.order = order.order;
          orderInfo.status = order.status;
          orderInfo.message = order.message;             
      }catch(err){
          return res.status(500).json({status: false, message: err.message});   
      }
      
      try{
          var productToUpdate = {quantity: (orderInfo.productInfo.quantity -orderInfo.quantity)};
          var productUpdInfo = await updateProductQty(orderInfo.productInfo._id, productToUpdate);
          res.status(status.OK).json(orderInfo); 
      }catch(err){
           return res.status(500).json({status: false, message: err.message});   
      }
      
      
  });
  
  app.get('/product', (req, res, next) => {
    repo.getAllMovies().then(movies => {
      res.status(status.OK).json(movies);
    }).catch(err => {
        return res.status(500).json({status: false, message: err.message}); 
    });
    
  });
  
  // here we get a movie by id
  app.get('/product/:id', (req, res, next) => {
    repo.getMovieById(req.params.id).then(movie => {
      res.status(status.OK).json(movie)
    }).catch(next)
  })
}
