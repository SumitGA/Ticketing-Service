import mongoose from "mongoose";
import { app } from './app';
import { natsWrapper } from "./nats-wrapper";

// Connecting to mongodb instance from the kube pod
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Mongo URI must be defined')
  }
  try {
    await natsWrapper.connect('ticketing', 'asdfkl', 'http://nats-srv:4222');
    //Closing nats connection when the server terminiates
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Connected to mongodb');
  } catch (err) {
    console.log(err);
  }
};

app.listen(3000, () => {
  console.log('Listening on port 3000')
})

start();