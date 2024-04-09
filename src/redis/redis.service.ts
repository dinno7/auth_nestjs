import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Redis, RedisKey } from 'ioredis';
import redisConfig from './configs/redis.config';

@Injectable()
export class RedisService implements OnModuleInit, OnApplicationShutdown {
  private __redisClient: Redis;
  constructor(
    @Inject(redisConfig.KEY)
    private redisConfiguration: ConfigType<typeof redisConfig>,
  ) {}

  insert(key: RedisKey, value: string | number | Buffer): Promise<string> {
    return this.__redisClient.set(key, value);
  }
  async validate(
    key: RedisKey,
    value: string | number | Buffer,
  ): Promise<boolean> {
    const stored = await this.__redisClient.get(key);
    return stored === value;
  }
  remove(key: RedisKey): Promise<number> {
    return this.__redisClient.del(key);
  }
  get(key: RedisKey): Promise<string> {
    return this.__redisClient.get(key);
  }
  onModuleInit() {
    this.__redisClient = new Redis({
      host: this.redisConfiguration.host,
      port: this.redisConfiguration.port,
    });
  }
  onApplicationShutdown() {
    return this.__redisClient.quit();
  }
}
