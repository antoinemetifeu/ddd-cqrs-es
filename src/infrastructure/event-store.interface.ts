import { IEvent } from '@domain/events/event.interface';

export interface IEventStore {
  get(): [IEvent[], number];
  save(events: IEvent[], eventSequenceNumber: number);
}
