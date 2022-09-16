import { IEvent } from './event.interface';

export class InvoiceValidated implements IEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly validatorId: string,
    public readonly validationAt: Date,
  ) {}
}
