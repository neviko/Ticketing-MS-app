import express, {Request, Response} from 'express';
import {CurrentUser, RequireAuth} from '@nevo-tickets/common';

const router = express.Router();

router.get('/api/users/currentuser', CurrentUser, RequireAuth, (req: Request,res:Response)=>{
  res.send({currentUser: req.currentUser || null});
});

export {router as currentUserRouter};