import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';

jest.mock('../nats-wrapper')

let mongo:any;
beforeAll(async ()=>{
  process.env.JWT_KEY = 'asdfasd';

  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri,{});
});

beforeEach(async ()=>{

  // delete all db collections before each test
  const collections = await mongoose.connection.db.collections();
  for(const collection of collections){
    await collection.deleteMany({});
  }

  jest.clearAllMocks()
});

afterAll(async () => {
  await mongo?.stop();
  await mongoose.connection.close();
});

 