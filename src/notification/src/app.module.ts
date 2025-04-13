import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';
import { NotificationModule } from './notification/notification.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: join(__dirname, '../../../.env') }),
    NotificationModule,
    MailerModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
