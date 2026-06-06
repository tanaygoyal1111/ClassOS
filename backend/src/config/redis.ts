import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const baseOptions = {
  maxRetriesPerRequest: null, // Required by BullMQ
};

// CRITICAL UPSTASH/BULLMQ CONFIG:
const redisUrl = process.env.REDIS_URL;

export const redisConnection = redisUrl 
  ? new Redis(redisUrl, { 
      ...baseOptions, 
      tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined 
    })
  : new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      ...baseOptions
    });

redisConnection.on('connect', () => {
  console.log('[Redis] Connected successfully.');
});

redisConnection.on('error', (err) => {
  console.error('[Redis Error]:', err);
});
