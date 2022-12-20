import express, {Request, Response} from 'express';
import {CurrentUser} from '../middlewares/current-user';
import {RequireAuth} from '../middlewares/require-auth';

const router = express.Router();

router.get('/api/users/currentuser', CurrentUser, RequireAuth, (req: Request,res:Response)=>{
  res.send({currentUser: req.currentUser || null});
});

export {router as currentUserRouter};