import { RequestValidationError } from '@sumitga-tickets/common';
import request from 'supertest'
import { app } from '../../app';
import { signin } from '../../test/setup';
import { Ticket } from '../../models/tickets';
import { JsonWebTokenError, sign } from 'jsonwebtoken';
import { natsWrapper } from '../../nats-wrapper';


it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});
  expect(response.status).not.toEqual(404);
})

it('it can only be accessed if user signed in ', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401)
});

describe('testing different features that should only pass with valid users', () => {
  it('returns  a status other than 401 if the user is signed in', async () => {
    const cookie = await signin();
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({})
    expect(response.status).not.toEqual(401);

  })

  it('it returns an error if invalid title is provides', async () => {
    const cookie = await signin();
    await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: '',
        price: 10
      })
      .expect(400)

    await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        price: 10
      })
      .expect(400)
  })

  it('returns an error if an invalid price is provided', async () => {
    const cookie = await signin();
    await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'klajkf2oi323',
        price: -10
      })
      .expect(400)

    await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: '1131kjlajdfla',
      })
      .expect(400)

  })
  it('creates a tickets with valid inputs', async () => {
    const cookie = await signin();
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'new ticket',
        price: 20
      })
      .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
  })
})

it('publishes an event', async () => {
  const cookie = await signin();
  const title = "sdfsdfs";

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title,
      price: 20,
    })
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
})
