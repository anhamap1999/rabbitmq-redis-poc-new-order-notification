import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvConfigInterface } from '@shared/envConfig';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  DEAD_LETTER_EXCHANGE,
  DEAD_LETTER_QUEUE,
  DLQ_ROUTING_KEY,
  EXCHANGE,
} from '@shared/rabbitmq/constants';
import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService<EnvConfigInterface>);

  const rmqUrl: RmqUrl = {
    hostname: configService.get('RABBITMQ_HOST'),
    port: configService.get('RABBITMQ_PORT'),
    username: configService.get('RABBITMQ_USER'),
    password: configService.get('RABBITMQ_PASSWORD'),
  };
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queueOptions: {
        durable: false,
        deadLetterExchange: DEAD_LETTER_EXCHANGE,
        deadLetterRoutingKey: DLQ_ROUTING_KEY,
        arguments,
      },
      exchange: EXCHANGE,
      routingKey: '#',
      noAck: false,
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: DEAD_LETTER_QUEUE,
      queueOptions: {
        durable: false,
      },
      exchange: DEAD_LETTER_EXCHANGE,
      routingKey: DLQ_ROUTING_KEY,
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get('NOTIFICATION_SERVICE_PORT'));
  console.log(
    'Notification service is running on port',
    configService.get('NOTIFICATION_SERVICE_PORT')
  );
}

bootstrap();
