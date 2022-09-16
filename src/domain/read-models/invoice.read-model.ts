export class InvoiceReadModel {
  constructor(
    private readonly _invoiceId: string,
    private readonly _amount: number,
    private readonly _sendAt: Date,
  ) {}

  get invoiceId() {
    return this._invoiceId;
  }

  get amount() {
    return this._amount;
  }

  get sendAt() {
    return this._sendAt;
  }
}
