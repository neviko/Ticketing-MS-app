import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {BadRequestError, ValidateRequest} from '@nevo-tickets/common';
import {buildUser, User} from '../models/user';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signup',[
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({min:4, max:20})
    .withMessage('password must be between 4 and 20 characters')
],
ValidateRequest,
async (req : Request,res : Response )=>{


  const {email,password} = req.body;
  const existingUser = await User.findOne({email});
  if(existingUser){
    throw new BadRequestError(`Email ${email} already in use`);
  }

  
  const user = buildUser({
    email,
    password
  });
  await user.save();

  // generate JWT 
  const userJwt = jwt.sign({
    id:user.id,
    email
  },process.env.JWT_KEY!);
  
  // store it on session object
  req.session= {
    jwt:userJwt
  };


  res.status(201).send(user);
});


export {router as signupRouter};


