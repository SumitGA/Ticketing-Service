import express from 'express';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { siginoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();
app.use(express.json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(siginoutRouter);

app.listen(3000, () => {
  console.log('Listening on port 3000')
})