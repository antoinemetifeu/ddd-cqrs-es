export class ValidateInvoice {
  readonly #invoiceId: string;
  readonly #validatorId: string;
  readonly #validationAt: Date;

  constructor(invoiceId: string, validatorId: string, validationAt: Date) {
    this.#invoiceId = invoiceId;
    this.#validatorId = validatorId;
    this.#validationAt = validationAt;
  }

  get invoiceId() {
    return this.#invoiceId;
  }

  get validatorId() {
    return this.#validatorId;
  }

  get validationAt() {
    return this.#validationAt;
  }
}
