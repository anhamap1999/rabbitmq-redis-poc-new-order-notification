import { Controller, Inject } from '@nestjs/common';
import { MAILER_SERVICE_TOKEN } from 'src/mailer/mailer.constants';
import { MailerServiceInterface } from 'src/mailer/mailer.interface';
import { BaseEvent, OrderCreatedEvent } from '@shared/rabbitmq/interfaces';
import {
  DLQ_ROUTING_KEY,
  QueueEvents,
  RETRIES_HEADER_KEY,
} from '@shared/rabbitmq/constants';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(
    @Inject() private readonly notificationService: NotificationService
  ) {}

  // TODO: event pattern is not working => fix later
  @EventPattern(QueueEvents.OrderCreated.toString())
  async handleOrderCreated(data: OrderCreatedEvent) {
    this.notificationService.notifyOrderCreated(data);
  }

  // TODO: event pattern is not working => fix later
  @EventPattern(DLQ_ROUTING_KEY)
  async catchDlqMessages(@Payload() data: BaseEvent<any>) {
    console.log('[RabbitMQ] DLQ received:', data);

    this.notificationService.handleDlqEvent(data);
  }

  @EventPattern()
  async catchAll(@Payload() data: any, @Ctx() ctx: RmqContext) {
    const rawMessage = ctx.getMessage();
    const routingKey = rawMessage.fields.routingKey;
    console.log('[RabbitMQ] Catch-All received:', routingKey, data);

    if (routingKey === DLQ_ROUTING_KEY) {
      await this.catchDlqMessages(data);
      return;
    }

    try {
      switch (routingKey) {
        case QueueEvents.OrderCreated.toString(): {
          await this.handleOrderCreated(data);
          break;
        }

        default:
          break;
      }
      ctx.getChannelRef().ack(rawMessage);
    } catch (error) {
      console.log('Error when handling event', data, error);
      let retries = rawMessage.properties?.headers?.[RETRIES_HEADER_KEY] || 0;

      retries++;
      if (retries >= 3) {
        ctx.getChannelRef().nack(rawMessage, false, false);
      } else {
        const headers = {
          ...(rawMessage.properties?.headers || {}),
          RETRIES_HEADER_KEY: retries,
        };
        ctx
          .getChannelRef()
          .publish('events', routingKey, rawMessage.content, { headers });
        ctx.getChannelRef().ack(rawMessage);
        console.log(`[RabbitMQ] Requeued #${retries} for event`, data);
      }
    }
  }
}
