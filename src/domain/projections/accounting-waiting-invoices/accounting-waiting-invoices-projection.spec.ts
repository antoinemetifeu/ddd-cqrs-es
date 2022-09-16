import { InvoiceReceived } from '../../events/invoice-received.event';
import { InvoiceValidated } from '../../events/invoice-validated.event';
import { AccountingWaitingInvoicesProjection } from './accounting-waiting-invoices.projection';
import { WaitingInvoicesReadModel } from '../../read-models/waiting-invoices.read-model';
import { InvoiceReadModel } from '../../read-models/invoice.read-model';
import { InMemoryAccountingWaitingInvoicesRepository } from '@infrastructure/projections/in-memory-accounting-waiting-invoices.repository';

describe('AccountingWaitingInvoicesProjection', () => {
  const invoiceId = '12345';
  const amount = 150;
  const filePath = '/my-invoice.pdf';
  const sendAt = new Date();
  const validatorId = '98765';
  const validationAt = new Date();

  describe('Given an empty projection', () => {
    describe('When InvoiceReceived', () => {
      it('Then the invoice exists', () => {
        const repository = new InMemoryAccountingWaitingInvoicesRepository();
        jest.spyOn(repository, 'save');

        const accountingWaitingInvoicesProjection =
          new AccountingWaitingInvoicesProjection(repository);

        accountingWaitingInvoicesProjection.when(
          new InvoiceReceived(invoiceId, amount, filePath, sendAt),
        );

        const readModel = accountingWaitingInvoicesProjection.readModel;

        const expected = new WaitingInvoicesReadModel([
          new InvoiceReadModel(invoiceId, amount, sendAt),
        ]);

        expect(repository.save).toHaveBeenCalledTimes(1);

        expect(expected.totalInvoices).toStrictEqual(readModel.totalInvoices);
        expect(expected.invoices).toStrictEqual(readModel.invoices);
      });
    });
  });

  describe('Given I have an invoice', () => {
    describe('When InvoiceValidated', () => {
      it('Then the invoice does not exist', () => {
        const repository = new InMemoryAccountingWaitingInvoicesRepository();
        jest.spyOn(repository, 'get').mockImplementation(() => {
          return new WaitingInvoicesReadModel([
            new InvoiceReadModel(invoiceId, amount, sendAt),
          ]);
        });
        jest.spyOn(repository, 'save');

        const accountingWaitingInvoicesProjection =
          new AccountingWaitingInvoicesProjection(repository);

        accountingWaitingInvoicesProjection.when(
          new InvoiceValidated(invoiceId, validatorId, validationAt),
        );

        const readModel = accountingWaitingInvoicesProjection.readModel;

        expect(repository.save).toHaveBeenCalledTimes(1);

        expect(0).toStrictEqual(readModel.totalInvoices);
        expect([]).toStrictEqual(readModel.invoices);
      });
    });
  });
});
