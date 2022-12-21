import request from 'supertest';
import {app} from '../../app';

it('should return a 201 on successful signup', async ()=>{
  return request(app)
    .post('/api/users/signup')
    .send({
      email:'test@test.com',
      password: 'password'
    })
    .expect(201);
}); 

it('should return a 400 with invalid email', async ()=>{
  return request(app)
    .post('/api/users/signup')
    .send({
      email:'tes',
      password: 'password'
    })
    .expect(400);
});

it('should return a 400 with invalid password', async ()=>{
  return request(app)
    .post('/api/users/signup')
    .send({
      email:'tes@aa.vb',
      password: 'r'
    })
    .expect(400);
});

it('should set a cookie after a valid signup', async ()=>{
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email:'tesr@ewe.vom',
      password: 'password'
    })
    .expect(201);

  expect( response.get('Set-Cookie')).toBeDefined();
});