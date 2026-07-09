import { CronExpression } from '@nestjs/schedule';
import dotenv from 'dotenv';

dotenv.config({});

const configuration = {
  app: {
    title: 'Weather Flow',
    description: 'Weather Flow API (Arquitectura de Software II)',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    version: process.env.SELF_VERSION ?? '-',
    api_version: process.env.SELF_VERSION ?? '-',
    options: { cors: { allowedHeaders: '*' } },
    docs: { path: 'docs' },
    health_string: 'Hello World!',
    dns_servers: process.env.DNS_SERVERS?.split(',') ?? [],
  },
  mongo: { uri: process.env.MONGO_URI! },
  service_bus: { connection_string: process.env.SERVICE_BUS_CONNECTION_STRING! },
  open_weather_map: { url: process.env.OPEN_WEATHER_MAP_URL!, api_key: process.env.OPEN_WEATHER_MAP_KEY! },
  weather_flow_weather: { url: process.env.WEATHER_FLOW_WEATHER_URL! },
  schedulers: {
    synchronize_providers: {
      cron: process.env.SCHEDULER_SYNCHRONIZE_STATIONS ?? CronExpression.EVERY_5_MINUTES,
      disabled: (process.env.SCHEDULER_SYNCHRONIZE_STATIONS_DISABLED ?? 'false') === 'true',
    },
  },
};

export type Configuration = typeof configuration;

export default (): Configuration => configuration;
