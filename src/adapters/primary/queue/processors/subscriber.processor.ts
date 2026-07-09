import { ServiceBusProcessorManager } from '../helpers/service-bus-processor-manager.helper';
import { Injectable } from '@nestjs/common';
import { ISubscriberService } from 'src/bussiness/ports/input/services/i-subscriber.service';
import { SubscriberDto } from './dtos/subscriber.dto';

@Injectable()
export class SubscriberProcessor {
  constructor(
    private readonly manager: ServiceBusProcessorManager,
    private readonly subscriberService: ISubscriberService,
  ) {
    this.manager.add('providers-subscriber', (data: SubscriberDto) => this.subscriber(data), SubscriberDto);
  }

  async subscriber(data: SubscriberDto): Promise<void> {
    if (data.type === 'create') await this.subscriberService.create(data.create_dto.toInput());
    if (data.type === 'edit') await this.subscriberService.editExternal(data.edit_dto.toInput());
    if (data.type === 'delete') await this.subscriberService.deleteExternal(data.delete_dto.external_id);
  }
}
