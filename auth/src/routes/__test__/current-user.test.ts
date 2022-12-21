import {response} from 'express';
import request from 'supertest';
import {app} from '../../app';
import {GetSignupCookie} from '../../test/signup-cookie';

it('should return the valid user using a cookie', async ()=>{

  const cookie = await GetSignupCookie();
  await request(app)
    .get('/api/users/currentuser')
    .set('Cookie',cookie)
    .expect(200);
}); 

it('should return null if not authenticated', async ()=>{
  await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(401);

//   expect(response.body).toEqual(null);
}); 