import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IWeatherProviderService } from 'src/bussiness/ports/output/services/i-weather-provider.service';
import { Configuration } from 'src/infrastructure/configuration/configuration';
import { OpenWeatherMapMeasurement } from './types/open-weather-map-measurement.type';
import { MeasurementOutput } from 'src/bussiness/ports/output/services/dtos/output/measurement.output';
import { Location } from 'src/bussiness/value-objects/location.value-object';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { CircuitBreaker } from '../helpers/circuit-breaker.helper';
import { ProviderError } from 'src/bussiness/errors/provider-error.error';

@Injectable()
export class OpenWeatherMapService implements IWeatherProviderService {
  private readonly url: string;
  private readonly apiKey: string;
  private readonly timeout: Configuration['timeout'];
  private readonly cacheConfig: Configuration['cache'];
  private readonly circuitBreakers: Record<string, CircuitBreaker>;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    const { url: baseUrl, api_key } =
      this.configService.get<Configuration['open_weather_map']>('open_weather_map')!;
    this.cacheConfig = this.configService.get<Configuration['cache']>('cache')!;
    this.timeout = this.configService.get<Configuration['timeout']>('timeout')!;
    this.url = `${baseUrl}/weather`;
    this.apiKey = api_key;
    const circuit_options = this.configService.get<Configuration['circuit_breakers']['open_weather_map']>(
      'circuit_breakers.open_weather_map',
    )!;
    this.circuitBreakers = {
      measure: new CircuitBreaker(
        circuit_options.failure_threshold,
        circuit_options.reset_timeouts,
        ProviderError,
      ),
    };
  }

  async measure(location: Location): Promise<MeasurementOutput> {
    const { measure: circuitBreaker } = this.circuitBreakers;
    return await circuitBreaker.execute(async () => {
      const query = `lat=${location.latitude}&lon=${location.longitude}&units=metric`;
      const result = await this.cacheManager.wrap(
        `owm/weather/${query}`,
        async () => {
          const result = this.httpService.get<OpenWeatherMapMeasurement>(
            `${this.url}?${query}&appid=${this.apiKey}`,
            { timeout: this.timeout.open_weather_map },
          );
          return await firstValueFrom(result);
        },
        this.cacheConfig.ttl.open_weather_map,
      );
      const { data } = result;
      const { pressure, temp: temperature, humidity } = data.main;
      return new MeasurementOutput(pressure, temperature, humidity);
    });
  }
}
