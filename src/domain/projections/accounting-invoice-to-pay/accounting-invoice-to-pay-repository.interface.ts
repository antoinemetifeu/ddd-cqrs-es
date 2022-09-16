import { AccountingInvoicesToPayReadModel as AccountingInvoicesToPayReadModel } from '../../read-models/accounting-invoices-to-pay.read-model';

export interface IAccountingInvoicesToPayRepository {
  get(): AccountingInvoicesToPayReadModel;
  save(model: AccountingInvoicesToPayReadModel);
}
