import express from 'express';
import constants from './config/constants';
import './config/database';
import middlewareConfig from './config/middleware';
import apiRoutes from './modules';

const app = express();

middlewareConfig(app);

app.get('/', (req, res) => {
  res.send('Hello world')
});

apiRoutes(app);
//
// const server = app.listen(3000, ()=>{
//   const {address, port} = server.address()
//   console.log(`listening on ${address}: ${port}`);
// })

app.listen(constants.PORT, err => {
  if (err) {
    throw err
  } else {
    console.log(`server running on ${constants.PORT}, server running on ${process.env.NODE_ENV}`);
  }
});
