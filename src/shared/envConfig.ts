import dotenv from 'dotenv';
import { join } from 'path';
dotenv.config({ path: join(__dirname, '../../.env') });

export interface EnvConfigInterface {
  ORDER_SERVICE_PORT: string;
  NOTIFICATION_SERVICE_PORT: string;

  POSTGRES_HOST: string;
  POSTGRES_PORT: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  POSTGRES_URL: string;

  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_USER: string;
  REDIS_PASSWORD: string;

  RABBITMQ_HOST: string;
  RABBITMQ_PORT: string;
  RABBITMQ_USER: string;
  RABBITMQ_PASSWORD: string;
}

export const ENV_CONFIG: EnvConfigInterface = {
  ORDER_SERVICE_PORT: process.env.ORDER_SERVICE_PORT,
  NOTIFICATION_SERVICE_PORT: process.env.NOTIFICATION_SERVICE_PORT,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_PORT: process.env.POSTGRES_PORT,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_URL: process.env.POSTGRES_URL,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_USER: process.env.REDIS_USER,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  RABBITMQ_HOST: process.env.RABBITMQ_HOST,
  RABBITMQ_PORT: process.env.RABBITMQ_PORT,
  RABBITMQ_USER: process.env.RABBITMQ_USER,
  RABBITMQ_PASSWORD: process.env.RABBITMQ_PASSWORD,
};
