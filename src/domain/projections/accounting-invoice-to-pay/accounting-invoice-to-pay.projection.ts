import { BaseProjection } from '../base-projection.abstract';
import { InvoiceReadModel } from '../../read-models/invoice.read-model';
import { InvoiceValidated } from '../../events/invoice-validated.event';
import { IAccountingInvoicesToPayRepository } from './accounting-invoice-to-pay-repository.interface';
import { AccountingInvoicesToPayReadModel } from '../../read-models/accounting-invoices-to-pay.read-model';
import { SEPAFileGenerated } from '@domain/events/sepa-file-generated.event';
export class AccountingInvoicesToPayProjection extends BaseProjection<AccountingInvoicesToPayReadModel> {
  _readModel = new AccountingInvoicesToPayReadModel([]);

  constructor(private repository: IAccountingInvoicesToPayRepository) {
    super();

    this._readModel = repository.get();
  }

  whenInvoiceValidated(event: InvoiceValidated) {
    // TODO: fix amount and sendAt ?
    this._readModel.invoices.push(
      new InvoiceReadModel(event.invoiceId, 2_000, event.validationAt),
    );

    this.repository.save(this._readModel);
  }

  whenSEPAFileGenerated(event: SEPAFileGenerated) {
    this._readModel.invoices = this._readModel.invoices.filter(
      (invoice) => invoice.invoiceId !== event.invoiceId,
    );

    this.repository.save(this._readModel);
  }
}
