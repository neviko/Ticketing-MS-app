import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {BadRequestError, ValidateRequest} from '@nevo-tickets/common';
import {User} from '../models/user';
import {Password} from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signin',[
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('password must be valid')
], 
ValidateRequest,
async (req: Request,res:Response)=>{
  const {email, password} = req.body;
  const existingUser = await User.findOne({email});
  if(!existingUser){
    throw new BadRequestError('invalid credentials');
  }

  const passwordMatch = await Password.compare(existingUser.password,password);

  if(!passwordMatch){
    throw new BadRequestError('invalid credentials');
  }

  // generate JWT 
  const userJwt = jwt.sign({
    id:existingUser.id,
    email
  },process.env.JWT_KEY!);

  // store it on session object
  req.session= {
    jwt:userJwt
  };


  res.status(201).send(existingUser);

});

export {router as signinRouter};
