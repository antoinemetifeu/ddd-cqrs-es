import { InMemoryAccountingInvoicesToPayRepository } from '@infrastructure/projections/in-memory-accounting-invoices-to-pay.repository';
import { InvoiceValidated } from '../../events/invoice-validated.event';
import { InvoiceReadModel } from '../../read-models/invoice.read-model';
import { AccountingInvoicesToPayProjection } from './accounting-invoice-to-pay.projection';
import { AccountingInvoicesToPayReadModel } from '../../read-models/accounting-invoices-to-pay.read-model';
import { SEPAFileGenerated } from '@domain/events/sepa-file-generated.event';

describe('AccountingInvoicesToPayProjection', () => {
  const invoiceId = '12345';
  const amount = 150;
  const sendAt = new Date();
  const validatorId = '98765';
  const validationAt = new Date();

  describe('Given an empty projection', () => {
    describe('When InvoiceValidated', () => {
      it('Then the invoice exists', () => {
        const repository = new InMemoryAccountingInvoicesToPayRepository();
        jest.spyOn(repository, 'save');

        const accountingWaitingInvoicesToPayProjection =
          new AccountingInvoicesToPayProjection(repository);

        accountingWaitingInvoicesToPayProjection.when(
          new InvoiceValidated(invoiceId, validatorId, validationAt),
        );

        const readModel = accountingWaitingInvoicesToPayProjection.readModel;

        // TODO: fix amount and sendAt
        const expected = new AccountingInvoicesToPayReadModel([
          new InvoiceReadModel(invoiceId, 2_000, validationAt),
        ]);

        expect(repository.save).toHaveBeenCalledTimes(1);

        expect(expected.invoices).toStrictEqual(readModel.invoices);
      });
    });
  });

  describe('Given I have an invoice', () => {
    describe('When SEPAGenerated', () => {
      it('Then the invoice does not exist', () => {
        const repository = new InMemoryAccountingInvoicesToPayRepository();
        jest.spyOn(repository, 'get').mockImplementation(() => {
          return new AccountingInvoicesToPayReadModel([
            new InvoiceReadModel(invoiceId, amount, sendAt),
          ]);
        });
        jest.spyOn(repository, 'save');

        const accountingWaitingInvoicesToPayProjection =
          new AccountingInvoicesToPayProjection(repository);

        accountingWaitingInvoicesToPayProjection.when(
          new SEPAFileGenerated(invoiceId),
        );

        const readModel = accountingWaitingInvoicesToPayProjection.readModel;

        expect(repository.save).toHaveBeenCalledTimes(1);

        expect([]).toStrictEqual(readModel.invoices);
      });
    });
  });
});
