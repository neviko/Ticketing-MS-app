import express, {Request, Response} from 'express';

const router = express.Router();

router.post('/api/users/signout',(req: Request,res)=>{

  req.session = null;
  res.send({});
   
  res.send('signout');
});

export {router as signoutRouter};

