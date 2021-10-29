import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { signin } from '../../test/setup';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
  const cookie = await signin();
  // Create a ticket with Ticket model
  const ticket = Ticket.build({
    id: '1',
    title: 'concert',
    price: 20
  });
  await ticket.save();
  // Make an request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);
  // Make a request to cancel order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(204);

  // Exepectation to test out the order have been cancelled
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)

})

it('Emits an order cancelled event', async () => {
  const cookie = await signin();
  // Create a ticket with Ticket model
  const ticket = Ticket.build({
    id: '1',
    title: 'concert',
    price: 20
  });
  await ticket.save();
  // Make an request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);
  // Make a request to cancel order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
})