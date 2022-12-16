import mongoose from 'mongoose';
import {Password} from '../services/password';

// an interface describes the props of a new user
interface IUserAttrs{
    email:string
    password: string
}

// an interface that describes the properties that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: IUserAttrs) :UserDoc
}

// an interface that describes the properties that a single Document has
// this is the place to describe the user structure in the DB
interface UserDoc extends mongoose.Document {
    email:string
    password:string
}

// represents the user structure in the DB
const userSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  }
});
/**
 * this function hashes the password if it being modified
 */
userSchema.pre('save',async function (done){

  if(this.isModified('password')){
    const hashed = await Password.toHash(this.get('password'));
    this.set('password',hashed);
  }
  done();
});

const User = mongoose.model<UserDoc,UserModel>('User',userSchema);

/**
 * this function created to force the right structure of a new user creation, so from now on
 * when we want to create a user we'll call the buildUser function
 */
const buildUser = (attrs: IUserAttrs)=>{
  return new User(attrs);
};


export {User, buildUser};