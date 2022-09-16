import { IEvent } from './event.interface';

export class SEPAFileGenerated implements IEvent {
  constructor(public readonly invoiceId: string) {}
}
