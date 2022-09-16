import { InvoiceValidated } from '@domain/events/invoice-validated.event';
import { InvoiceReceived } from '@domain/events/invoice-received.event';
import { EventPublisher } from './event-publisher';
import { InMemoryEventStore } from './in-memory-event-store';

describe('EventPublisher', () => {
  const aggregateId = '12345';
  const invoiceId = 'invoice-12345';
  const amount = 2_000;
  const filepath = 'invoice.pdf';
  const sendAt = new Date();
  const validatorId = '98765';
  const validationAt = new Date();

  describe('Given an EventPublisher', () => {
    describe('When I publish events', () => {
      test('Then events are persisted', () => {
        const store = new InMemoryEventStore();
        jest.spyOn(store, 'save');

        const eventPublisher = new EventPublisher(store);

        const events = [
          new InvoiceReceived(aggregateId, invoiceId, amount, filepath, sendAt),
          new InvoiceValidated(
            aggregateId,
            invoiceId,
            validatorId,
            validationAt,
          ),
        ];

        eventPublisher.publish(events);

        expect(store.save).toHaveBeenCalledTimes(1);
      });

      test('Then events are published to associated handlers', () => {
        const store = new InMemoryEventStore();

        const eventPublisher = new EventPublisher(store);

        const mockCallback = jest.fn((x) => x);

        eventPublisher.subscribe(InvoiceReceived.name, mockCallback);
        eventPublisher.subscribe(InvoiceReceived.name, mockCallback);
        eventPublisher.subscribe(InvoiceValidated.name, mockCallback);

        const events = [
          new InvoiceReceived(aggregateId, invoiceId, amount, filepath, sendAt),
          new InvoiceValidated(
            aggregateId,
            invoiceId,
            validatorId,
            validationAt,
          ),
        ];

        eventPublisher.publish(events);

        expect(mockCallback.mock.calls.length).toBe(3);
        expect(mockCallback.mock.results[0].value).toStrictEqual(events[0]);
        expect(mockCallback.mock.results[1].value).toStrictEqual(events[0]);
        expect(mockCallback.mock.results[2].value).toStrictEqual(events[1]);
      });
    });
  });
});
