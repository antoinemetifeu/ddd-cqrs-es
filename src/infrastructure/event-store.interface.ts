import { IEvent } from '@domain/events/event.interface';

export interface IEventStore {
  save(events: IEvent[]);
}
