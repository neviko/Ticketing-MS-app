import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';

/**
 * 
 * a helper function for create a user and return the cookie
 */
export const GetSignupCookie = ()=>{
  
  // build a jwt payload {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(), // generates a valid id,
    email:'abc@abc.com'
  }
  // create a JWT
  const token = jwt.sign(payload,process.env.JWT_KEY!)

  // build a session object {jwt: my JWT}
  const session = {jwt: token}
  
  // turn that object into a JSON
  const sessionJSON = JSON.stringify(session)
  
  // take JSON and encode it as base64
  const base64 =  Buffer.from(sessionJSON).toString('base64')
  
  // concatenate string like 
  return [`session=${base64}`]

}; 
