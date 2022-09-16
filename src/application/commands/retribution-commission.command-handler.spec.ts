import { EventPublisher } from '@infrastructure/event-publisher';
import { InMemoryEventStore } from '@infrastructure/in-memory-event-store';
import { RetributionCommissionCommandHandler } from './retribution-commission.command-handler';
import { SendInvoice } from '@domain/send-invoice';

describe('RetributionCommissionCommandHandler', () => {
  const aggregateId = '12345';
  const invoiceId = 'invoice-12345';
  const amount = 2_000;
  const filepath = 'invoice.pdf';
  const sendAt = new Date();

  describe('When i call the handler', () => {
    test('The event is saved in the store', () => {
      const store = new InMemoryEventStore();

      const eventStorePublisher = new EventPublisher(store);
      const retributionCommissionCommandHandler =
        new RetributionCommissionCommandHandler(eventStorePublisher, store);

      retributionCommissionCommandHandler.sendInvoice(
        aggregateId,
        new SendInvoice(invoiceId, amount, filepath, sendAt),
      );

      expect(store.get()[0]).toHaveLength(1);
    });
  });
});
