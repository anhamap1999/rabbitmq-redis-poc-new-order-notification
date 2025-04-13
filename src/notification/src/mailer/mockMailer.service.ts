import { Injectable } from '@nestjs/common';
import { MailerServiceInterface } from './mailer.interface';

@Injectable()
export class MockMailerService implements MailerServiceInterface {
  async send(email: string, subject: string, content: string): Promise<void> {
    // TODO: replace by nodemailer
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('[MockMailerService] Sent mail.');
  }
}
