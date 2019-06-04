const status = require('http-status')

module.exports = (app, options) => {
  console.log("options: ", options);
  const {repo} = options
  
  // here we get all the products
  
  app.post('/product/add', (req, res, next) => {
     var productInfo = req.body;
     if(!productInfo.name){
         return res.status(405).json({status: false, message: "name can not be empty"});
     }
     if(!productInfo.skew_code){
        return  res.status(405).json({status: false, message: "skew_code can not be empty"});
     }
     if(productInfo.quantity < 0){
        return  res.status(405).json({status: false, message: "quantity can not be negative"});
     }
     repo.addProduct(productInfo).then(product =>{
         res.status(status.OK).json(product);
     }).catch(err =>{
         return  res.status(500).json({status: false, message: err.message});
     });
  });
  
  app.get('/product', (req, res, next) => {
    repo.getAllMovies().then(movies => {
      res.status(status.OK).json(movies)
    }).catch(err =>{
         return  res.status(500).json({status: false, message: err.message});
    });
  })
  
  // here we get a movie by id
  app.get('/product/:id', (req, res, next) => {
    repo.getProductById(req.params.id).then(productDet => {
      res.status(status.OK).json(productDet)
    }).catch(err =>{
         return  res.status(500).json({status: false, message: err.message});
    });
  });
    
  app.put('/product/:id', (req, res, next) => {
    var DataToUpdate = req.body;
    repo.updateProduct(req.params.id, DataToUpdate).then(productDet => {
      res.status(status.OK).json(productDet)
    }).catch(err =>{
         return  res.status(500).json({status: false, message: err.message});
    });
  });
    
}
