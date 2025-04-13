export enum QueueEvents {
  OrderCreated = 'order.created',
}

export const EXCHANGE = 'events';
export const DEAD_LETTER_EXCHANGE = 'event-dlx';
export const DEAD_LETTER_QUEUE = 'event-dlq';
export const DLQ_ROUTING_KEY = 'to-dlq';

export const RETRIES_HEADER_KEY = 'x-retries';
