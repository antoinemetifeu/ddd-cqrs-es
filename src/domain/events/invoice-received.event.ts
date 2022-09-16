import { IEvent } from './event.interface';

export class InvoiceReceived implements IEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly amount: number,
    public readonly filePath: string,
    public readonly sendAt: Date,
  ) {}
}
