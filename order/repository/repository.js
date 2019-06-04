var mongo = require('mongodb');

const repository = (db) => {
  
  const collection = db.collection('order');

  const createOrder = (orderInfo) => {
       return new Promise((resolve, reject) => {
           var orderDet = { address: orderInfo.address, productId: orderInfo.productId, quantity:orderInfo.quantity, price:orderInfo.price, status:"placed" };
           collection.insert(orderDet, function(err, order) {
               if (err){
                 return reject(err);   
               }
               return resolve({status:true, message:"success", order: order});
               
           });
       });                 
      
  }

  const placeOrder = (id) => {
    return new Promise((resolve, reject) => {
      const projection = { _id: 0, id: 1, title: 1, format: 1 }
      const shippedOrder = (err, order) => {
        if (err) {
          reject(new Error(`An error occured fetching a movie with id: ${id}, err: ${err}`))
        }        
        resolve({status:true, message: "success"});
      }
      var o_id = new mongo.ObjectID(id);
      collection.update({_id: o_id}, {$set:{status:"shipped"}}, shippedOrder)
    })
  }
  
  // this will close the database connection
  const disconnect = () => {
    db.close()
  }

  return Object.create({
    createOrder,
    placeOrder
  })
}

const connect = (connection) => {
  return new Promise((resolve, reject) => {
    if (!connection) {
      reject(new Error('connection db not supplied!'))
    }
    resolve(repository(connection))
  })
}

module.exports = Object.assign({}, {connect})
