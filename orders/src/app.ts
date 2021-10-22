import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@sumitga-tickets/common';
import { json } from 'body-parser';


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}))
app.use(currentUser);

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);
export { app };