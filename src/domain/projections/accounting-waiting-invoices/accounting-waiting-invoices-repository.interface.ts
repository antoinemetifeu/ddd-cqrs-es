import { WaitingInvoicesReadModel } from '../../read-models/waiting-invoices.read-model';

export interface IAccountingWaitingInvoicesRepository {
  get(): WaitingInvoicesReadModel;
  save(model: WaitingInvoicesReadModel);
}
