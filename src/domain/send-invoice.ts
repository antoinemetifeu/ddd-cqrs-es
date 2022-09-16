import { Amount } from './amount';

export class SendInvoice {
  readonly #invoiceId: string;
  readonly #amount: Amount;
  readonly #filePath: string;
  readonly #sendAt: Date;

  constructor(
    invoiceId: string,
    amount: number,
    filePath: string,
    sendAt: Date,
  ) {
    this.#invoiceId = invoiceId;
    this.#amount = new Amount(amount);
    this.#filePath = filePath;
    this.#sendAt = sendAt;
  }

  get id() {
    return this.#invoiceId;
  }

  get amount() {
    return this.#amount.value;
  }

  get filePath() {
    return this.#filePath;
  }

  get sendAt() {
    return this.#sendAt;
  }
}
