import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

interface IUserPayload{
    id:string
    email:string
}

// optionally add to the Express Request interface the
//currentuser of type ICurrentUser
declare global{
    namespace Express{
        interface Request{
            currentUser?: IUserPayload
        }
    }
}

export const CurrentUser = (req:Request,res:Response,next:NextFunction)=>{
  if(!req.session?.jwt){
    return next();
    //in this scenario - req.currentUser will be undefined
  }
  try{
    const payload = jwt.verify(req.session?.jwt,process.env.JWT_KEY!) as IUserPayload;
    req.currentUser = payload;
  }
  catch(err){
  }
  next();
};