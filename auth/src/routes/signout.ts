import express from 'express';

const router = express.Router();

router.post('/api/users/signout',(req,res)=>{

  // check if JWT is exist in cookie and valid

  // 
  res.send('signout');
});

export {router as signoutRouter};

