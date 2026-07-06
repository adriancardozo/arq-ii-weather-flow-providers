import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { IProviderService } from 'src/bussiness/ports/input/services/i-provider.service';
import { CONFIG_SERVICE } from 'src/infrastructure/configuration/config.service';
import { Configuration } from 'src/infrastructure/configuration/configuration';

const { synchronize_providers } = CONFIG_SERVICE.get<Configuration['schedulers']>('schedulers')!;

@Injectable()
export class ProviderScheduler {
  private readonly logger = new Logger(ProviderScheduler.name);

  constructor(private readonly providerService: IProviderService) {}

  @Cron(synchronize_providers.cron, { disabled: synchronize_providers.disabled })
  async synchronizeProviders(): Promise<void> {
    this.logger.log('Synchronizing providers.');
    await this.providerService.synchronizeProviders();
    this.logger.log('Providers synchronization finished.');
  }
}
