import { Injectable, Logger } from '@nestjs/common';
import { IWeatherProviderManagerService } from '../ports/output/services/i-weather-provider-manager.service';
import { Subscriber } from '../entities/subscriber.entity';
import { ISubscriberRepository } from '../ports/output/repositories/i-subscriber.repository';
import { ISubscriberService } from '../ports/input/services/i-subscriber.service';
import { Service } from './service';
import { CreateSubscriberInput } from '../ports/input/services/dtos/input/create-subscriber.input';
import { EditSubscriberInput } from '../ports/input/services/dtos/input/edit-subscriber.input';
import { ITransactionService } from '../ports/output/services/i-transaction.service';
import { INotifierManagerService } from '../ports/output/services/i-notifier-manager.service';
import { EditExternalSubscriberInput } from '../ports/input/services/dtos/input/edit-external-subscriber.input';

@Injectable()
export class SubscriberService<Session = any>
  extends Service<Subscriber, CreateSubscriberInput, EditSubscriberInput, Session, ISubscriberRepository>
  implements ISubscriberService
{
  private readonly logger: Logger = new Logger(SubscriberService.name);

  constructor(
    repository: ISubscriberRepository,
    transactionService: ITransactionService,
    private readonly subscriberReposiroty: ISubscriberRepository,
    private readonly notifierManagerService: INotifierManagerService,
    private readonly providerManagerService: IWeatherProviderManagerService,
  ) {
    super(repository, transactionService);
  }

  async deleteExternal(externalId: string, session?: Session): Promise<Subscriber> {
    return await this.transactionService.transaction(async (session) => {
      const subscriber = this.getByExternalId(externalId, session);
      await this.repository.deleteOneBy({ externalId }, session);
      return subscriber;
    }, session);
  }

  async editExternal(input: EditExternalSubscriberInput, session?: Session): Promise<Subscriber> {
    const { id } = await this.getByExternalId(input.externalId, session);
    return await this.edit(id!, input, session);
  }

  async synchronizeSubscribers(session?: Session): Promise<void> {
    await this.transactionService.transaction(async (session) => {
      const subscribers = await this.subscriberReposiroty.find({}, session);
      for (const subscriber of subscribers) await this.synchronizeSubscriber(subscriber);
    }, session);
  }

  private async synchronizeSubscriber(subscriber: Subscriber): Promise<void> {
    try {
      const providerService = this.providerManagerService.getProviderService(subscriber.provider);
      const measurementOutput = await providerService.measure(subscriber.location);
      const notifierService = this.notifierManagerService.getNotifierService(subscriber.notifier);
      await notifierService.notify(subscriber, measurementOutput);
    } catch (error) {
      this.logger.error(error);
      this.logger.error(
        `Error on synchronize subscriber '${subscriber.name}' with external id '${subscriber.externalId}' and provider '${subscriber.provider}'`,
      );
    }
  }

  private async getByExternalId(externalId: string, session?: Session): Promise<Subscriber> {
    return await this.transactionService.transaction(async (session) => {
      return await this.repository.findOneByOrFail({ externalId }, session);
    }, session);
  }
}
