import { IEvent } from './event.interface';

export class SEPAFileGenerated implements IEvent {
  constructor(private readonly _invoiceId: string) {}

  get invoiceId() {
    return this._invoiceId;
  }
}
