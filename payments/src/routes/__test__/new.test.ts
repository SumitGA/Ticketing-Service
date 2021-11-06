import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { signin } from '../../test/setup';
import mongoose from 'mongoose';
import { OrderStatus } from '@sumitga-tickets/common';
import { createSemanticDiagnosticsBuilderProgram } from 'typescript';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';


it('returns a 404 when purchasing an order that does not exists', async () => {
  const cookie = await signin();
  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'ssdfsdf',
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that does not belongs to user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });

  await order.save();

  const cookie = await signin();
  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'ssdfsdf',
      orderId: order.id
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const cookie = await signin(userId);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      orderId: order.id,
      token: 'sgdfsfds'
    })
    .expect(400);
});

it('returns a 201 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 1000);
  const cookie = await signin(userId);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'tok_visa',
      orderId: order.id
    })
    .expect(201)

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find(charge => {
    return charge.amount === price * 100
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('aud');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id
  });
  expect(payment).not.toBeNull();
});