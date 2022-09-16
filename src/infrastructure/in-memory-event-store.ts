import { IEventStore } from './event-store.interface';
import { IEvent } from '@domain/events/event.interface';
export class InMemoryEventStore implements IEventStore {
  #events: IEvent[] = [];

  save(event: IEvent) {
    this.#events.push(event);
  }
}
