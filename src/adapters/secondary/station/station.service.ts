import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SynchronizeProviderInput } from 'src/bussiness/ports/input/services/dtos/input/synchronize-provider.input';
import { IStationService } from 'src/bussiness/ports/output/services/i-station.service';
import { Configuration } from 'src/infrastructure/configuration/configuration';
import { StationResponse } from './responses/station.response';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StationService implements IStationService {
  private readonly url: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const { url: baseUrl } =
      this.configService.get<Configuration['weather_flow_weather']>('weather_flow_weather')!;
    this.url = `${baseUrl}/station`;
  }

  async findWithProvider(): Promise<Array<SynchronizeProviderInput>> {
    const result = this.httpService.get<Array<StationResponse>>(this.url);
    const { data } = await firstValueFrom(result);
    const withProvider = data.filter((station) => !!station.provider);
    return withProvider.map(
      ({ provider, id, name, location }) => new SynchronizeProviderInput(provider!, id, name, location),
    );
  }
}
