import { Publisher, OrderCreatedEvent, Subjects } from "@sumitga-tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
