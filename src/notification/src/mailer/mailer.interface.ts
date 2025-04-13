export interface MailerServiceInterface {
  send(email: string, subject: string, content: string): void;
}
