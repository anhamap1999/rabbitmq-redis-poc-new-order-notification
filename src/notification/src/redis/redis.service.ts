import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_TTL } from '@shared/redis/constants';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getCachedValue<T>(cacheKey: string): Promise<T> {
    let cachedValue: T = await this.cacheManager.get(cacheKey);
    console.log(
      '[Redis] Get cached value for',
      cacheKey,
      !cachedValue ? '=> Not found value.' : '=> Found value.'
    );

    return cachedValue;
  }
  async cacheValue<T>(cacheKey: string, data: T): Promise<void> {
    await this.cacheManager.set(cacheKey, data, CACHE_TTL);
    console.log('[Redis] Set cached value for', cacheKey);
  }
}
