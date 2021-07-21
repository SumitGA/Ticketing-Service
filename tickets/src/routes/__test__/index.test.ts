import { tSEnumDeclaration } from '@babel/types';
import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/setup';
import { createTicketRouter } from '../new';

const createTicket = async () => {
  const cookie = await signin();
  return request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdfs',
      price: 20
    });

}

it('can fetch a list of tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();
  const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200)

  expect(response.body.length).toEqual(3);
})