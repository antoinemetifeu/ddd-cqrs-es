import { IEvent } from './event.interface';

export class InvoiceInvalidated implements IEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly validatorId: string,
    public readonly validationAt: Date,
  ) {}
}
