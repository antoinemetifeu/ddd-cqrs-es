import { IEvent } from './event.interface';

export class SEPAFileGenerated implements IEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly invoiceId: string,
  ) {}
}
