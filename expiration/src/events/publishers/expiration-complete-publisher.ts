import { Subjects, Publisher, ExpirationCompleteEvent } from '@sumitga-tickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}