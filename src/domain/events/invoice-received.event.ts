import { IEvent } from './event.interface';

export class InvoiceReceived implements IEvent {
  constructor(
    private readonly _invoiceId: string,
    private readonly _amount: number,
    private readonly _filePath: string,
    private readonly _sendAt: Date,
  ) {}

  get invoiceId() {
    return this._invoiceId;
  }

  get amount() {
    return this._amount;
  }

  get filePath() {
    return this._filePath;
  }

  get sendAt() {
    return this._sendAt;
  }
}
