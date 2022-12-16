import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import mongoose from 'mongoose';

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(errorHandler);

// if a route not found call to not found error, which it will call to error handler 
app.all('*',async ()=>{
  throw new NotFoundError();
});

const start = async ()=>{
  try{
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.error('Connected to MongoDB'); 

  }
  catch(err){
    console.error(err); 
  }
  app.listen(3000,()=>{
    console.log('Listening on port 3000');
  });
};

start();










