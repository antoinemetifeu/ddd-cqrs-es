import { InvoiceInvalidated } from './events';
import { InvoiceReceived } from './events/invoice-received.event';
import { InvoiceValidated } from './events/invoice-validated.event';
import { SEPAFileGenerated } from './events/sepa-file-generated.event';
import { SendInvoice } from './send-invoice';
import { RetributionCommission } from './retribution-commission';
import { PendingRetributionInvoiceException } from './exceptions/pending-retribution-invoice.exception';
import { ValidateInvoice } from './validate-invoice';

describe('RetributionCommision', () => {
  const aggregateId = '12345';
  const invoiceId = 'invoice-12345';
  const amount = 1_000;
  const filePath = 'invoice_1234.pdf';
  const sendAt = new Date();
  const validatorId = '98765';
  const validationAt = new Date();

  describe('Given I do not have invoice', () => {
    describe('When I send in invoice', () => {
      test('Then I get an InvoiceReceived event', () => {
        const retributionCommission = new RetributionCommission(aggregateId);

        const event = retributionCommission.sendInvoice(
          new SendInvoice(invoiceId, amount, filePath, sendAt),
        );

        expect(event).toStrictEqual([
          new InvoiceReceived(aggregateId, invoiceId, amount, filePath, sendAt),
        ]);
      });
    });

    describe('When I send in invoice with amount < 100 €', () => {
      // TODO: add an exception
      test('Then I get an error', () => {
        const retributionCommission = new RetributionCommission(aggregateId);

        expect(() => {
          retributionCommission.sendInvoice(
            new SendInvoice(invoiceId, 69, filePath, sendAt),
          );
        }).toThrow();
      });
    });
  });

  describe('Given I have sent an invoice', () => {
    describe('When I send an invoice', () => {
      test('Then I get a PendingRetributionInvoiceException', () => {
        const retributionCommission = new RetributionCommission(aggregateId, [
          new InvoiceReceived(aggregateId, invoiceId, amount, filePath, sendAt),
        ]);

        expect(() => {
          retributionCommission.sendInvoice(
            new SendInvoice(invoiceId, amount, filePath, sendAt),
          );
        }).toThrow(PendingRetributionInvoiceException);
      });
    });

    describe('When I validate the invoice', () => {
      test('Then I get an InvoiceValidated event', () => {
        const retributionCommission = new RetributionCommission(aggregateId, [
          new InvoiceReceived(aggregateId, invoiceId, amount, filePath, sendAt),
        ]);

        const event = retributionCommission.validateInvoice(
          new ValidateInvoice(invoiceId, validatorId, validationAt),
        );

        expect(event).toStrictEqual([
          new InvoiceValidated(
            aggregateId,
            invoiceId,
            validatorId,
            validationAt,
          ),
        ]);
      });
    });
  });

  describe('Given I have sent an invoice which has been validated', () => {
    describe('When I send an invoice', () => {
      test('Then I get an InvoiceReceived event', () => {
        const retributionCommission = new RetributionCommission(aggregateId, [
          new InvoiceReceived(aggregateId, invoiceId, amount, filePath, sendAt),
          new InvoiceValidated(
            aggregateId,
            invoiceId,
            validatorId,
            validationAt,
          ),
        ]);

        const event = retributionCommission.sendInvoice(
          new SendInvoice(invoiceId, amount, filePath, sendAt),
        );

        expect(event).toStrictEqual([
          new InvoiceReceived(aggregateId, invoiceId, amount, filePath, sendAt),
        ]);
      });
    });

    describe('When I generate SEPA file', () => {
      test('Then I get an SEPAFileGenerated event', () => {
        const retributionCommission = new RetributionCommission(aggregateId, [
          new InvoiceReceived(aggregateId, invoiceId, amount, filePath, sendAt),
          new InvoiceValidated(
            aggregateId,
            invoiceId,
            validatorId,
            validationAt,
          ),
        ]);

        const event = retributionCommission.generateSEPAFile(invoiceId);

        expect(event).toStrictEqual([
          new SEPAFileGenerated(aggregateId, invoiceId),
        ]);
      });
    });

    describe('Given I have sent an invoice which has been invalidated', () => {
      describe('When I send an invoice', () => {
        test('Then I get an InvoiceReceived event', () => {
          const retributionCommission = new RetributionCommission(aggregateId, [
            new InvoiceReceived(
              aggregateId,
              invoiceId,
              amount,
              filePath,
              sendAt,
            ),
            new InvoiceInvalidated(
              aggregateId,
              invoiceId,
              validatorId,
              validationAt,
            ),
          ]);

          const event = retributionCommission.sendInvoice(
            new SendInvoice(invoiceId, amount, filePath, sendAt),
          );

          expect(event).toStrictEqual([
            new InvoiceReceived(
              aggregateId,
              invoiceId,
              amount,
              filePath,
              sendAt,
            ),
          ]);
        });
      });
    });
  });
});
