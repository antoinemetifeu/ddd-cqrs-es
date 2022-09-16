import { IEvent } from '@domain/events/event.interface';

export type handler = (event: IEvent) => void;

export interface IEventPublisher {
  publish(events: IEvent[], eventSequenceNumber: number);
  subscribe(eventType: string, cb: handler);
}
