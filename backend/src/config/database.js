import mongoose from 'mongoose';
import constants from './constants';
//handle warning with Promise
mongoose.Promise = global.Promise;

//connect the db to your url
try {
  mongoose.connect(constants.MONGO_URL);
} catch (err){
  mongoose.createConnection(constants.MONGO_URL);
}
mongoose.connection
  .once('open', () => console.log('mongodb is running'))
  .on('error', err => {
    throw err;
  });
