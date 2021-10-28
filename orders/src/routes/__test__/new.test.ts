import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/setup';
import { JsonWebTokenError, sign } from 'jsonwebtoken';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';


it('returns an error if the ticket does not exists', async () => {
  const ticketId = mongoose.Types.ObjectId();
  const cookie = await signin();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId })
    .expect(404)
})

it('return an error if the ticket is already reserved', async () => {
  const cookie = await signin();
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: 'asdfasdf',
    status: OrderStatus.Created,
    expiresAt: new Date()
  });
  await order.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(400);
})

it('reserves a ticket', async () => {
  const cookie = await signin();
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201)
})

it('emits an order created event', async () => {
  const cookie = await signin();
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled();
})