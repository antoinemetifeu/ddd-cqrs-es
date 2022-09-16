import { IEvent } from '@domain/events/event.interface';
import { type handler, IEventPublisher } from './event-publisher.interface';
import { IEventStore } from './event-store.interface';

export class EventPublisher implements IEventPublisher {
  #handlers = new Map<string, handler[]>();

  constructor(private readonly eventStore: IEventStore) {}

  public publish(events: IEvent[]) {
    this.eventStore.save(events);

    events.forEach((event) => {
      const eventType = event.constructor.name;

      if (!this.#handlers.has(eventType)) {
        return;
      }

      this.#handlers.get(eventType).forEach((handler) => {
        handler(event);
      });
    });
  }

  public subscribe(eventType: string, cb: handler) {
    if (!this.#handlers.has(eventType)) {
      this.#handlers.set(eventType, []);
    }

    this.#handlers.get(eventType).push(cb);
  }
}
