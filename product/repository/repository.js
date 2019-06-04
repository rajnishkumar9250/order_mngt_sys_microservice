var mongo = require('mongodb');


const repository = (db) => {
  
  const collection = db.collection('product');

  const addProduct = (productInfo) => {
       return new Promise((resolve, reject) => {
           var prodDet = { name: productInfo.name, skew_code: productInfo.skew_code, brand:productInfo.brand_name, quantity: productInfo.quantity };
           collection.insertOne(prodDet, function(err, res) {
               if (err){
                 return reject(err);   
               }
               return resolve({status:true, message:"success"});
               
           });
       });                 
      
  }

  const getMoviePremiers = () => {
    return new Promise((resolve, reject) => {
      const movies = []
      const currentDay = new Date()
      const query = {
        releaseYear: {
          $gt: currentDay.getFullYear() - 1,
          $lte: currentDay.getFullYear()
        },
        releaseMonth: {
          $gte: currentDay.getMonth() + 1,
          $lte: currentDay.getMonth() + 2
        },
        releaseDay: {
          $lte: currentDay.getDate()
        }
      }
      const cursor = collection.find(query)
      const addMovie = (movie) => {
        movies.push(movie)
      }
      const sendMovies = (err) => {
        if (err) {
          reject(new Error('An error occured fetching all movies, err:' + err))
        }
        resolve(movies)
      }
      cursor.forEach(addMovie, sendMovies)
    })
  }

  const getProductById = (id) => {
    return new Promise((resolve, reject) => {
      const projection = { _id: 0, id: 1, title: 1, format: 1 }
      const sendMovie = (err, product) => {
        if (err) {
          reject(new Error(`An error occured fetching a movie with id: ${id}, err: ${err}`));
        }
        console.log("product details: ", product);
        resolve(product);
      }
      // fetch a movie by id -- mongodb syntax
      var o_id = new mongo.ObjectID(id);
      collection.findOne({_id: o_id}, sendMovie);
    })
  }
  
  const updateProduct = (id, dataToSet) => {
    return new Promise((resolve, reject) => {
      const ProductDet = (err, order) => {
        if (err) {
          reject(new Error(`An error occured updating product with id: ${id}, err: ${err}`))
        }        
        resolve({status:true, message: "success"});
      }
      // fetch a movie by id -- mongodb syntax
       var o_id = new mongo.ObjectID(id);
      collection.update({_id: o_id}, {$set:dataToSet}, ProductDet)
    })
  }
  
  // this will close the database connection
  const disconnect = () => {
    db.close()
  }

  return Object.create({    
    addProduct,
    getMoviePremiers,
    getProductById,
    updateProduct,
    disconnect
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
// this only exports a connected repo
module.exports = Object.assign({}, {connect})
