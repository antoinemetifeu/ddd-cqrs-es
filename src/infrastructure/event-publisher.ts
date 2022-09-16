import { IEvent } from '@domain/events/event.interface';
import { type handler, IEventPublisher } from './event-publisher.interface';
import { IEventStore } from './event-store.interface';

export class EventPublisher implements IEventPublisher {
  #subscribers = new Map<string, handler[]>();

  constructor(private readonly store: IEventStore) {}

  public publish(events: IEvent[]) {
    this.store.save(events);

    events.forEach((event) => {
      const eventType = event.constructor.name;

      if (!this.#subscribers.has(eventType)) {
        return;
      }

      this.#subscribers.get(eventType).forEach((handler) => {
        handler(event);
      });
    });
  }

  public subscribe(eventType: string, cb: handler) {
    if (!this.#subscribers.has(eventType)) {
      this.#subscribers.set(eventType, []);
    }

    this.#subscribers.get(eventType).push(cb);
  }
}
