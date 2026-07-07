import { Injectable, Logger } from '@nestjs/common';
import { IProviderService } from '../ports/input/services/i-provider.service';
import { IWeatherProviderManagerService } from '../ports/output/services/i-weather-provider-manager.service';
import { IStationService } from '../ports/output/services/i-station.service';
import { IMeasurementService } from '../ports/output/services/i-measurement.service';
import { SynchronizeProviderInput } from '../ports/input/services/dtos/input/synchronize-provider.input';

@Injectable()
export class ProviderService implements IProviderService {
  private readonly logger: Logger = new Logger(ProviderService.name);

  constructor(
    private readonly stationService: IStationService,
    private readonly measurementService: IMeasurementService,
    private readonly providerManagerService: IWeatherProviderManagerService,
  ) {}

  async synchronizeProviders(): Promise<void> {
    const inputs = await this.stationService.findWithProvider();
    for (const input of inputs) await this.synchronizeProvider(input);
    //   return stations;
  }

  private async synchronizeProvider(input: SynchronizeProviderInput): Promise<void> {
    try {
      const providerService = this.providerManagerService.getProviderService(input.provider);
      const measurementInput = await providerService.measure(input.station_id, input.location);
      await this.measurementService.sendToCreate(measurementInput);
    } catch (error) {
      this.logger.error(error);
      this.logger.error(
        `Error on synchronize station '${input.station_name}' with '${input.station_id}' and provider '${input.provider}'`,
      );
    }
  }
}
