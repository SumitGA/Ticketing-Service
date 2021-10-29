import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { signin } from '../../test/setup';

it('fetches the order', async () => {
  const cookie = await signin();
  // Crate a ticket
  const ticket = Ticket.build({
    id: '1',
    title: 'concert',
    price: 20
  })

  await ticket.save();
  // Make a request  to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201)
  // Make request to fetch the order
  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200)

  expect(fetchOrder.id).toEqual(order.id);
})