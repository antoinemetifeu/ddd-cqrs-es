import { IAccountingWaitingInvoicesRepository } from '@domain/projections/accounting-waiting-invoices/accounting-waiting-invoices-repository.interface';
import { WaitingInvoicesReadModel } from '@domain/read-models/waiting-invoices.read-model';

export class InMemoryAccountingWaitingInvoicesRepository
  implements IAccountingWaitingInvoicesRepository
{
  #invoices = [];

  get(): WaitingInvoicesReadModel {
    return new WaitingInvoicesReadModel(this.#invoices);
  }

  save(readModel: WaitingInvoicesReadModel) {
    this.#invoices = readModel.invoices;
  }
}
