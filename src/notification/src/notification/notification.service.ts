import { Inject, Injectable } from '@nestjs/common';
import { MAILER_SERVICE_TOKEN } from 'src/mailer/mailer.constants';
import { MailerServiceInterface } from 'src/mailer/mailer.interface';
import { BaseEvent, OrderCreatedEvent } from '@shared/rabbitmq/interfaces';
import { LogStatus, User } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { getUserCacheKey } from '@shared/redis';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(MAILER_SERVICE_TOKEN)
    private readonly mailerService: MailerServiceInterface,
    @Inject() private readonly prismaService: PrismaService,
    @Inject() private readonly redisService: RedisService
  ) {}

  async notifyOrderCreated(data: OrderCreatedEvent) {
    if (!data.body) {
      return;
    }

    const cacheKey = getUserCacheKey(data.body.userId);
    let userInfo: User = await this.redisService.getCachedValue(cacheKey);

    if (!userInfo) {
      userInfo = await this.prismaService.user.findFirstOrThrow({
        where: { id: data.body.userId },
      });

      await this.redisService.cacheValue(cacheKey, userInfo);
    }

    await this.mailerService.send(
      userInfo.email,
      'New order',
      'Your order is placed successfully.'
    );

    await this.prismaService.log.create({
      data: { body: JSON.stringify(data.body), event: data.event },
    });
  }

  async handleDlqEvent(data: BaseEvent<any>) {
    await this.prismaService.log.create({
      data: {
        body: JSON.stringify(data.body),
        event: data.event,
        status: LogStatus.FAILED,
      },
    });
  }
}
