import { rabbitmqClient } from './client';
import { EXCHANGE, QueueEvents } from './constants';
import { BaseEvent } from './interfaces';

export const publishMessage = async (data: BaseEvent) => {
  try {
    await rabbitmqClient.channel.publish(
      EXCHANGE,
      data.event.toString(),
      Buffer.from(JSON.stringify(data))
    );

    console.log('[RabbitMQ] Published message:', JSON.stringify(data));
  } catch (error) {
    console.error('[RabbitMQ] Error when publishing message:', error);
  }
};

export const subscribeMessage = async (
  bindingKey: QueueEvents | string,
  consumerFn: (data: BaseEvent) => void
) => {
  try {
    const queue = await rabbitmqClient.channel.assertQueue('', {
      exclusive: true,
    });
    await rabbitmqClient.channel.bindQueue(
      queue.queue,
      EXCHANGE,
      bindingKey.toString()
    );
    await rabbitmqClient.channel.consume(
      queue.queue,
      (msg) => {
        const eventData: BaseEvent = JSON.parse(msg.content.toString());
        consumerFn(eventData);
      },
      { noAck: false }
    );
    console.log(`[RabbitMQ] Subscribed ${bindingKey.toString()}.`);
  } catch (error) {
    console.error('[RabbitMQ] Error when publishing message: ', error);
  }
};
