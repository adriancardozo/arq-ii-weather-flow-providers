import { Injectable } from '@nestjs/common';
import { MeasurementOutput } from 'src/bussiness/ports/output/services/dtos/output/measurement.output';
import { ServiceBusQueueService } from '../../service-bus/services/service-bus-queue.service';
import { INotifierService } from 'src/bussiness/ports/output/services/i-notifier.service';
import { Subscriber } from 'src/bussiness/entities/subscriber.entity';
import { RegisterMeasurementInput } from 'src/bussiness/ports/output/services/dtos/input/register-measurement.input';

@Injectable()
export class MeasurementQueueService implements INotifierService {
  constructor(private readonly queueService: ServiceBusQueueService) {}

  async notify(
    subscriber: Subscriber,
    { pressure, temperature, humidity }: MeasurementOutput,
  ): Promise<void> {
    await this.queueService.send(
      'measurement',
      new RegisterMeasurementInput(pressure, temperature, humidity, subscriber.externalId),
    );
  }
}
