import { IEvent } from './events/event.interface';
import { SendInvoice } from './send-invoice';
import {
  InvoiceReceived,
  InvoiceInvalidated,
  InvoiceValidated,
} from './events';
import { SEPAFileGenerated } from './events/sepa-file-generated.event';
import { PendingRetributionInvoiceException } from './exceptions/pending-retribution-invoice.exception';
import { RetributionCommissionProjection } from './retribution-commission.projection';
import { ValidateInvoice } from './validate-invoice';

export class RetributionCommission {
  #retributionCommissionProjection = new RetributionCommissionProjection();

  constructor(private readonly id: string, history: IEvent[] = []) {
    this.apply(history);
  }

  public sendInvoice(sendInvoice: SendInvoice) {
    if (this.#retributionCommissionProjection.hasPendingInvoice) {
      throw new PendingRetributionInvoiceException();
    }

    return this.apply([
      new InvoiceReceived(
        sendInvoice.id,
        sendInvoice.amount,
        sendInvoice.filePath,
        sendInvoice.sendAt,
      ),
    ]);
  }

  public validateInvoice(validateInvoice: ValidateInvoice) {
    if (!this.#retributionCommissionProjection.hasPendingInvoice) {
      throw new Error('No Pending Invoice');
    }

    return this.apply([
      new InvoiceValidated(
        validateInvoice.invoiceId,
        validateInvoice.validatorId,
        validateInvoice.validationAt,
      ),
    ]);
  }

  // TODO: add class for args
  public invalidateInvoice(
    invoiceId: string,
    validatorId: string,
    validationAt: Date,
  ) {
    if (!this.#retributionCommissionProjection.hasPendingInvoice) {
      throw new Error('No Pending Invoice');
    }

    return this.apply([
      new InvoiceInvalidated(invoiceId, validatorId, validationAt),
    ]);
  }

  public generateSEPAFile(invoiceId: string) {
    return this.apply([new SEPAFileGenerated(invoiceId)]);
  }

  private onInvoiceReceived(_event: InvoiceReceived) {
    this.#retributionCommissionProjection.hasPendingInvoice = true;
  }

  private onInvoiceValidated(_event: InvoiceValidated) {
    this.#retributionCommissionProjection.hasPendingInvoice = false;
  }

  private onInvoiceInvalidated(_event: InvoiceInvalidated) {
    this.#retributionCommissionProjection.hasPendingInvoice = false;
  }

  private onSEPAFileGenerated(_event: SEPAFileGenerated) {
    // TODO: change decision projection for that event here
  }

  private apply(events: IEvent[]) {
    events.forEach((event) => {
      const handler = this[`on${event.constructor.name}`];
      handler && handler.call(this, event);
    });

    return events;
  }
}
