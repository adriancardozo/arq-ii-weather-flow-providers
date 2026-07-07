import { Logger, Module } from '@nestjs/common';
import { AppController } from './adapters/primary/http/controllers/app.controller';
import { IProviderService } from './bussiness/ports/input/services/i-provider.service';
import { ProviderService } from './bussiness/services/provider.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './infrastructure/configuration/configuration';
import { ServiceBusQueueService } from './adapters/secondary/service-bus/services/service-bus-queue.service';
import { ServiceBusClient } from '@azure/service-bus';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ProviderScheduler } from './adapters/primary/nestjs-schedule/schedulers/provider.scheduler';
import { WeatherProviderManagerService } from './adapters/secondary/weather-providers/services/weather-provider-manager.service';
import { IWeatherProviderManagerService } from './bussiness/ports/output/services/i-weather-provider-manager.service';
import { OpenWeatherMapService } from './adapters/secondary/weather-providers/services/open-weather-map.service';
import { StationService } from './adapters/secondary/station/station.service';
import { IStationService } from './bussiness/ports/output/services/i-station.service';
import { MeasurementService } from './adapters/secondary/measurement/services/measurement.service';
import { IMeasurementService } from './bussiness/ports/output/services/i-measurement.service';

const { service_bus } = configuration();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    ProviderScheduler,
    { provide: ServiceBusClient, useValue: new ServiceBusClient(service_bus.connection_string) },
    Logger,
    OpenWeatherMapService,
    WeatherProviderManagerService,
    { provide: IWeatherProviderManagerService, useExisting: WeatherProviderManagerService },
    ProviderService,
    { provide: IProviderService, useExisting: ProviderService },
    StationService,
    { provide: IStationService, useExisting: StationService },
    MeasurementService,
    { provide: IMeasurementService, useExisting: MeasurementService },
    ServiceBusQueueService,
  ],
})
export class AppModule {}
