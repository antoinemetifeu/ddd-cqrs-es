import { IAccountingInvoicesToPayRepository } from '@domain/projections/accounting-invoice-to-pay/accounting-invoice-to-pay-repository.interface';
import { AccountingInvoicesToPayReadModel } from '@domain/read-models/accounting-invoices-to-pay.read-model';

export class InMemoryAccountingInvoicesToPayRepository
  implements IAccountingInvoicesToPayRepository
{
  #invoices = [];

  get(): AccountingInvoicesToPayReadModel {
    return new AccountingInvoicesToPayReadModel(this.#invoices);
  }

  save(readModel: AccountingInvoicesToPayReadModel) {
    this.#invoices = readModel.invoices;
  }
}
