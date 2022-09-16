import { IEventStore } from './event-store.interface';
import { IEvent } from '@domain/events/event.interface';

interface InMemoryEvent {
  aggregateId: string;
  // aggregateName: string;
  eventSequenceNumber: number;
  payload: string;
}

export class InMemoryEventStore implements IEventStore {
  #events: InMemoryEvent[] = [];

  get(): [IEvent[], number] {
    const events: IEvent[] = [];
    let lastEventSequenceNumber = 0;

    this.#events.forEach((event) => {
      events.push(JSON.parse(event.payload));
      lastEventSequenceNumber = event.eventSequenceNumber;
    });

    return [events, lastEventSequenceNumber];
  }

  private getLastEventSequenceNumberOfMyAggregateStreamId(
    streamId: string,
  ): number {
    return this.#events
      .filter((event) => event.aggregateId === streamId)
      .reduce(
        (acc, event) =>
          event.eventSequenceNumber > acc ? event.eventSequenceNumber : acc,
        0,
      );
  }

  save(events: IEvent[], eventSequenceNumber: number) {
    const lastEventSequenceNumber =
      this.getLastEventSequenceNumberOfMyAggregateStreamId(
        events[0].aggregateId,
      );

    if (eventSequenceNumber !== lastEventSequenceNumber) {
      throw new Error('Bad history');
    }

    events.forEach((event) =>
      this.#events.push({
        aggregateId: event.aggregateId,
        eventSequenceNumber: eventSequenceNumber++,
        payload: JSON.stringify(event),
      }),
    );
  }
}
