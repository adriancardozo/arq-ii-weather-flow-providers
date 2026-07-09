import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ISubscriberService } from 'src/bussiness/ports/input/services/i-subscriber.service';
import { CONFIG_SERVICE } from 'src/infrastructure/configuration/config.service';
import { Configuration } from 'src/infrastructure/configuration/configuration';

const { synchronize_providers } = CONFIG_SERVICE.get<Configuration['schedulers']>('schedulers')!;

@Injectable()
export class SubscriberScheduler {
  private readonly logger = new Logger(SubscriberScheduler.name);

  constructor(private readonly subscriberService: ISubscriberService) {}

  @Cron(synchronize_providers.cron, { disabled: synchronize_providers.disabled })
  async synchronizeSubscribers(): Promise<void> {
    this.logger.log('Synchronizing providers.');
    await this.subscriberService.synchronizeSubscribers();
    this.logger.log('Providers synchronization finished.');
  }
}
