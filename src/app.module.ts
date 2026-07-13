import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './adapters/primary/http/controllers/app.controller';
import { ISubscriberService } from './bussiness/ports/input/services/i-subscriber.service';
import { SubscriberService } from './bussiness/services/subscriber.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './infrastructure/configuration/configuration';
import { ServiceBusQueueService } from './adapters/secondary/service-bus/services/service-bus-queue.service';
import { ServiceBusAdministrationClient, ServiceBusClient } from '@azure/service-bus';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { SubscriberScheduler } from './adapters/primary/nestjs-schedule/schedulers/subscriber.scheduler';
import { WeatherProviderManagerService } from './adapters/secondary/weather-providers/services/weather-provider-manager.service';
import { IWeatherProviderManagerService } from './bussiness/ports/output/services/i-weather-provider-manager.service';
import { OpenWeatherMapService } from './adapters/secondary/weather-providers/services/open-weather-map.service';
import { MeasurementQueueService } from './adapters/secondary/notifiers/services/measurement-queue.service';
import { NotifierManagerService } from './adapters/secondary/notifiers/services/notifier-manager.service copy';
import { INotifierManagerService } from './bussiness/ports/output/services/i-notifier-manager.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscriber } from './bussiness/entities/subscriber.entity';
import { SubscriberSchema } from './adapters/secondary/mongo/schemas/document/subscriber.schema';
import { MongoSubscriberRepository } from './adapters/secondary/mongo/repositories/mongo-subscriber.repository';
import { ISubscriberRepository } from './bussiness/ports/output/repositories/i-subscriber.repository';
import { MongoTransactionService } from './adapters/secondary/mongo/services/mongo-transaction.service';
import { ITransactionService } from './bussiness/ports/output/services/i-transaction.service';
import { SubscriberController } from './adapters/primary/http/controllers/subscriber.controller';
import { SubscriberProcessor } from './adapters/primary/queue/processors/subscriber.processor';
import { ServiceBusProcessorManager } from './adapters/primary/queue/helpers/service-bus-processor-manager.helper';
import { ExternalSubscriberController } from './adapters/primary/http/controllers/external-subscriber.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { Keyv } from 'keyv';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { exporter } from './infrastructure/open-telemetry/instrumentation';
import { MetricsMiddleware } from './adapters/primary/http/middlewares/metrics.middleware';

const { service_bus, mongo, redis, cache } = configuration();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot(mongo.uri),
    MongooseModule.forFeature([{ name: Subscriber.name, schema: SubscriberSchema }]),
    HttpModule,
    ScheduleModule.forRoot(),
    CacheModule.registerAsync({
      useFactory: async () => {
        if (cache.disabled) return { stores: [], ttl: -1 };
        const { default: KeyvRedis } = await import('@keyv/redis');
        return { stores: [new Keyv(), ...(redis.url ? [new KeyvRedis(redis.url, redis.options)] : [])] };
      },
    }),
  ],
  controllers: [AppController, SubscriberController, ExternalSubscriberController],
  providers: [
    SubscriberScheduler,
    SubscriberProcessor,
    { provide: ServiceBusClient, useValue: new ServiceBusClient(service_bus.connection_string) },
    {
      provide: ServiceBusAdministrationClient,
      useValue: new ServiceBusAdministrationClient(service_bus.connection_string),
    },
    ServiceBusProcessorManager,
    Logger,
    OpenWeatherMapService,
    WeatherProviderManagerService,
    { provide: IWeatherProviderManagerService, useExisting: WeatherProviderManagerService },
    MeasurementQueueService,
    NotifierManagerService,
    { provide: INotifierManagerService, useExisting: NotifierManagerService },
    SubscriberService,
    { provide: ISubscriberService, useExisting: SubscriberService },
    MongoTransactionService,
    { provide: ITransactionService, useExisting: MongoTransactionService },
    MongoSubscriberRepository,
    { provide: ISubscriberRepository, useExisting: MongoSubscriberRepository },
    ServiceBusQueueService,
    { provide: PrometheusExporter, useValue: exporter },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsMiddleware).exclude('/metrics').forRoutes('*');
  }
}
