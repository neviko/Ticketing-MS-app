import express from 'express';

const router = express.Router();

router.get('/api/users/currentuser',(req,res)=>{
  console.log('current user');
  res.send('Hi there Nevo');
});

export {router as currentUserRouter };