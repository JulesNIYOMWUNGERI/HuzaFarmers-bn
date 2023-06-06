import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  url: process.env.REDIS_CLIENT_URL,
  connect_timeout: 60000,
});

client.on('error', err => err);

client.connect();

export default client;
