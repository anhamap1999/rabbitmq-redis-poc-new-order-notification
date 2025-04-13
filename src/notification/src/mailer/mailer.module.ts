import { Module, Provider } from '@nestjs/common';
import { MockMailerService } from './mockMailer.service';
import { MAILER_SERVICE_TOKEN } from './mailer.constants';

const MailerProvider: Provider = {
  provide: MAILER_SERVICE_TOKEN,
  useClass: MockMailerService
};

@Module({ providers: [MailerProvider], exports: [MailerProvider] })
export class MailerModule {}
