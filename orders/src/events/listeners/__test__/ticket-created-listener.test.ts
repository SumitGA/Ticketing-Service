import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { TicketCreatedListener } from "../ticket-created-listener";
import { Message } from 'node-nats-streaming';
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@sumitga-tickets/common";

const setup = async () => {
  // Create an instance   of listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString()
  }

  // create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg }
}

it('Creates an saves a ticket', async () => {
  // call the onMessage function with the data  object + message object
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  // write assertions to make sure a ticket was created!!
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  // expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data  object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called.
  expect(msg.ack).toHaveBeenCalled();
});