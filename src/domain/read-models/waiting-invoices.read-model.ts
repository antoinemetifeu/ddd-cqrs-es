import { InvoiceReadModel } from './invoice.read-model';

export class WaitingInvoicesReadModel {
  public invoices: InvoiceReadModel[] = [];

  constructor(invoices: InvoiceReadModel[]) {
    this.invoices = invoices;
  }

  get totalInvoices() {
    return this.invoices.length;
  }
}
