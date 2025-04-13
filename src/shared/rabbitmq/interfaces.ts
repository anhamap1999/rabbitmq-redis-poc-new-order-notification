import { Order } from '@prisma/client';
import { QueueEvents } from './constants';

export interface BaseEvent<E = unknown, D = unknown> {
  event: E;
  body?: D;
}

export interface OrderCreatedEvent
  extends BaseEvent<QueueEvents.OrderCreated, Order> {}
