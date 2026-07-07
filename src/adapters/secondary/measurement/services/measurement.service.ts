import { RegisterMeasurementInput } from 'src/bussiness/ports/output/services/dtos/input/register-measurement.input';
import { IMeasurementService } from 'src/bussiness/ports/output/services/i-measurement.service';
import { ServiceBusQueueService } from '../../service-bus/services/service-bus-queue.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MeasurementService implements IMeasurementService {
  constructor(private readonly queueService: ServiceBusQueueService) {}

  async sendToCreate(measurementInput: RegisterMeasurementInput): Promise<void> {
    await this.queueService.send('measurement', measurementInput);
  }
}
