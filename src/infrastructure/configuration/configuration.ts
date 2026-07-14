import { KeyvRedisOptions } from '@keyv/redis';
import { CronExpression } from '@nestjs/schedule';
import dotenv from 'dotenv';

dotenv.config({});

const cache_disabled = process.env.CACHE_DISABLED ? process.env.CACHE_DISABLED === 'true' : false;

function ttl(ttl: number): number {
  return cache_disabled ? -1 : ttl;
}

const service_bus_connection_string = process.env.SERVICE_BUS_CONNECTION_STRING!;

const emulator_string = 'UseDevelopmentEmulator=true';

const service_bus_emulated = (service_bus_connection_string ?? '').includes(emulator_string);

const configuration = {
  app: {
    title: 'Weather Flow - Providers',
    description: 'Weather Flow Providers API (Arquitectura de Software II)',
    service_name: 'providers',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    version: process.env.SELF_VERSION ?? '-',
    api_version: process.env.SELF_VERSION ?? '-',
    options: { cors: { allowedHeaders: '*' } },
    docs: { path: 'docs' },
    health_string: 'Hello World!',
    dns_servers: process.env.DNS_SERVERS?.split(',') ?? [],
  },
  mongo: { uri: process.env.MONGO_URI! },
  service_bus: { connection_string: service_bus_connection_string, emulated: service_bus_emulated },
  open_weather_map: { url: process.env.OPEN_WEATHER_MAP_URL!, api_key: process.env.OPEN_WEATHER_MAP_KEY! },
  weather_flow_weather: { url: process.env.WEATHER_FLOW_WEATHER_URL! },
  schedulers: {
    synchronize_providers: {
      cron: process.env.SCHEDULER_SYNCHRONIZE_STATIONS ?? CronExpression.EVERY_5_MINUTES,
      disabled: (process.env.SCHEDULER_SYNCHRONIZE_STATIONS_DISABLED ?? 'false') === 'true',
    },
  },
  redis: {
    url: process.env.REDIS_CACHE_URL,
    options: { connectionTimeout: process.env.REDIS_CACHE_CONNECTION_TIMEOUT ?? 2000 } as KeyvRedisOptions,
  },
  cache: {
    disabled: cache_disabled,
    ttl: { open_weather_map: ttl(parseInt(process.env.OPEN_WEATHER_MAP_CACHE_TTL ?? `${3 * 60 * 1000}`)) },
  },
  timeout: { open_weather_map: parseInt(process.env.OPEN_WEATHER_MAP_TIMEOUT ?? '1500') },
  insights: { connection_string: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING },
};

export type Configuration = typeof configuration;

export default (): Configuration => configuration;
