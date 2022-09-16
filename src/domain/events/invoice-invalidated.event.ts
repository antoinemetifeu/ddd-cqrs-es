import { IEvent } from './event.interface';

export class InvoiceInvalidated implements IEvent {
  constructor(
    private readonly _invoiceId: string,
    private readonly _validatorId: string,
    private readonly _validationAt: Date,
  ) {}

  get invoiceId() {
    return this._invoiceId;
  }

  get validatorId() {
    return this._validatorId;
  }

  get validationAt() {
    return this._validationAt;
  }
}
