import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';

import {errorHandler, NotFoundError, CurrentUser} from '@nevo-tickets/common';
import cookieSession from 'cookie-session';
import { indexOrderRouter } from './routes';
import { deleteOrderRouter } from './routes/delete';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';

const app = express();
app.set('trust proxy',true); // we trust proxy because traffic will be arrived via ingress nginx
app.use(json());
app.use(cookieSession({
  signed:false, // disables encryption
  secure: process.env.NODE_ENV !== 'test' , // return cookie only if using https protocol

}));

app.use(CurrentUser)
app.use(errorHandler);

app.use(indexOrderRouter)
app.use(deleteOrderRouter)
app.use(newOrderRouter)
app.use(showOrderRouter)

// if a route not found call to not found error, which it will call to error handler 
app.all('*',async ()=>{
  throw new NotFoundError();
});


export {app};