import { InvoiceReadModel } from './invoice.read-model';

export class AccountingInvoicesToPayReadModel {
  public invoices: InvoiceReadModel[] = [];

  constructor(invoices: InvoiceReadModel[]) {
    this.invoices = invoices;
  }
}
