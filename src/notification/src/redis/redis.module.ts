import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfigInterface } from '@shared/envConfig';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfigInterface>) => ({
        stores: [
          createKeyv({
            socket: {
              host: configService.get('REDIS_HOST'),
              port: configService.get('REDIS_PORT'),
            },
            username: configService.get('REDIS_USER'),
            password: configService.get('REDIS_PASSWORD'),
          }),
        ],
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
