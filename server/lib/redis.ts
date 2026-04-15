import Redis from 'ioredis';
import { log } from '../vite';

const REDIS_URL = process.env.REDIS_URL;

class RedisCache {
  private client: Redis | null = null;
  private isConnected = false;

  constructor() {
    if (process.env.NODE_ENV === 'test' || !REDIS_URL) return;

    try {
      this.client = new Redis(REDIS_URL, {
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => {
          if (times > 2) {
            log('Redis connection failed, falling back to no-cache mode.');
            this.isConnected = false;
            return null;
          }
          return Math.min(times * 200, 1000);
        },
        lazyConnect: true,
      });

      this.client.on('connect', () => {
        log('Redis connected successfully.');
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
      });

      this.client.connect().catch(() => {
        log('Redis unavailable, running without cache.');
      });
    } catch (err) {
      log('Redis initialization failed, running without cache.');
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected || !this.client) return null;
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      log(`Error getting cache for key ${key}: ${err}`);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds = 3600): Promise<void> {
    if (!this.isConnected || !this.client) return;
    try {
      const data = JSON.stringify(value);
      await this.client.setex(key, ttlSeconds, data);
    } catch (err) {
      log(`Error setting cache for key ${key}: ${err}`);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected || !this.client) return;
    try {
      await this.client.del(key);
    } catch (err) {
      log(`Error deleting cache for key ${key}: ${err}`);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    if (!this.isConnected || !this.client) return;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (err) {
      log(`Error deleting cache pattern ${pattern}: ${err}`);
    }
  }
}

export const cache = new RedisCache();
