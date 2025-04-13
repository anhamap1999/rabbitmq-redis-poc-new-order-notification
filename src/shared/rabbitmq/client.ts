import amqp, { ChannelModel, Channel } from 'amqplib';
import { ENV_CONFIG } from '@shared/envConfig';
import { EXCHANGE } from './constants';

const {
  RABBITMQ_HOST: hostname,
  RABBITMQ_PASSWORD: password,
  RABBITMQ_PORT: port,
  RABBITMQ_USER: username,
} = ENV_CONFIG;

export class RabbitmqClient {
  private _client: ChannelModel;
  private _channel: Channel;
  constructor(private readonly url: string | amqp.Options.Connect) {
    this.init();
  }

  async init() {
    try {
      this._client = await amqp.connect(this.url);
      this._channel = await this._client.createChannel();
      await rabbitmqClient.channel.assertExchange(EXCHANGE, 'topic', {
        durable: true,
      });
      console.log('[RabbitMQ] Connected and channel created.');
    } catch (error) {
      console.error(
        '[RabbitMQ] Error when connecting and creating channel',
        error
      );
    }
  }

  get client() {
    return this._client;
  }
  get channel() {
    return this._channel;
  }
}

const rabbitmqClient = new RabbitmqClient({
  hostname,
  port: parseInt(port),
  password,
  username,
});

export { rabbitmqClient };
