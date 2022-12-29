import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import {currentUserRouter} from './routes/current-user';
import {signinRouter} from './routes/signin';
import {signoutRouter} from './routes/signout';
import {signupRouter} from './routes/signup';
import {errorHandler, NotFoundError} from '@nevo-tickets/common';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy',true); // we trust proxy because traffic will be arrived via ingress nginx
app.use(json());
app.use(cookieSession({
  signed:false, // disables encryption
  secure: process.env.NODE_ENV !== 'test' , // return cookie only if using https protocol

}));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(errorHandler);

// if a route not found call to not found error, which it will call to error handler 
app.all('*',async ()=>{
  throw new NotFoundError();
});


export {app};