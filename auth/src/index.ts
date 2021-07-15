import express from 'express';
import 'express-async-errors';
import { currentUserRouter } from './routes/current-user';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { signinRouter } from './routes/signin';
import { siginoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import { json } from 'body-parser';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: true
}))

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(siginoutRouter);

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

// Connecting to mongodb instance from the kube pod
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Connected to mongodb');
  } catch (err) {
    console.log(err);
  }
};

app.use(errorHandler);
app.listen(3000, () => {
  console.log('Listening on port 3000')
})

start();