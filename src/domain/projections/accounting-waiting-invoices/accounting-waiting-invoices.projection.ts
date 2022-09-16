import { InvoiceReceived } from '../../events/invoice-received.event';
import { InvoiceValidated } from '../../events/invoice-validated.event';
import { BaseProjection } from '../base-projection.abstract';
import { IAccountingWaitingInvoicesRepository } from './accounting-waiting-invoices-repository.interface';
import { InvoiceReadModel } from '../../read-models/invoice.read-model';
import { WaitingInvoicesReadModel } from '../../read-models/waiting-invoices.read-model';

export class AccountingWaitingInvoicesProjection extends BaseProjection<WaitingInvoicesReadModel> {
  _readModel = new WaitingInvoicesReadModel([]);

  constructor(private repository: IAccountingWaitingInvoicesRepository) {
    super();

    this._readModel = repository.get();
  }

  whenInvoiceReceived(event: InvoiceReceived) {
    this._readModel.invoices.push(
      new InvoiceReadModel(event.invoiceId, event.amount, event.sendAt),
    );

    this.repository.save(this._readModel);
  }

  whenInvoiceValidated(event: InvoiceValidated) {
    this._readModel.invoices = this._readModel.invoices.filter(
      (invoice) => invoice.invoiceId !== event.invoiceId,
    );

    this.repository.save(this._readModel);
  }
}
