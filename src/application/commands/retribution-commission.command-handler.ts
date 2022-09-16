import { RetributionCommission } from '@domain/retribution-commission';
import { SendInvoice } from '@domain/send-invoice';
import { IEventPublisher } from '@infrastructure/event-publisher.interface';
import { IEventStore } from '@infrastructure/event-store.interface';

export class RetributionCommissionCommandHandler {
  constructor(
    private readonly _eventPublisher: IEventPublisher,
    private readonly _eventStore: IEventStore,
  ) {}

  public sendInvoice(aggregateId: string, sendInvoice: SendInvoice): void {
    const [history, lastEventSequenceNumber] = this._eventStore.get();

    const aggregate = new RetributionCommission(aggregateId, history);

    const events = aggregate.sendInvoice(sendInvoice);

    this._eventPublisher.publish(events, lastEventSequenceNumber);
  }
}
