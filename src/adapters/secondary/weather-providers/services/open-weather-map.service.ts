import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IWeatherProviderService } from 'src/bussiness/ports/output/services/i-weather-provider.service';
import { Configuration } from 'src/infrastructure/configuration/configuration';
import { OpenWeatherMapMeasurement } from './types/open-weather-map-measurement.type';
import { MeasurementOutput } from 'src/bussiness/ports/output/services/dtos/output/measurement.output';
import { Location } from 'src/bussiness/value-objects/location.value-object';

@Injectable()
export class OpenWeatherMapService implements IWeatherProviderService {
  private readonly url: string;
  private readonly apiKey: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const { url: baseUrl, api_key } =
      this.configService.get<Configuration['open_weather_map']>('open_weather_map')!;
    this.url = `${baseUrl}/weather`;
    this.apiKey = api_key;
  }

  async measure(location: Location): Promise<MeasurementOutput> {
    const result = this.httpService.get<OpenWeatherMapMeasurement>(
      `${this.url}?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${this.apiKey}`,
    );
    const { data } = await firstValueFrom(result);
    const { pressure, temp: temperature, humidity } = data.main;
    return new MeasurementOutput(pressure, temperature, humidity);
  }
}
