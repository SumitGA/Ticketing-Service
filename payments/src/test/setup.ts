import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_88ecQjRsfmHyDBoEedT6Wc9h';

let mongo: any
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
})

const signin = async (id?: string) => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object. { jwt: My_JWT}
  const session = { jwt: token }

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string that the cookie with the encoded data
  return `express:sess=${base64}`;
};

export { signin };