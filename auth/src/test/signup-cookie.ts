import request from 'supertest';
import {app} from '../app';

/**
 * 
 * a helper function for create a user and return the cookie
 */
export const GetSignupCookie = async ()=>{
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email:'tesr@ewe.vom',
      password: 'password'
    })
    .expect(201);
  
  expect( response.get('Set-Cookie')).toBeDefined();
  console.log(response.get('Set-Cookie'));
  return response.get('Set-Cookie');
}; 
