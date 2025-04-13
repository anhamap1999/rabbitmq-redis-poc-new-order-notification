import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { MailerModule } from 'src/mailer/mailer.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfigInterface } from '@shared/envConfig';
import { createKeyv } from '@keyv/redis';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationService } from './notification.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    MailerModule,
    RedisModule,
    PrismaModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
