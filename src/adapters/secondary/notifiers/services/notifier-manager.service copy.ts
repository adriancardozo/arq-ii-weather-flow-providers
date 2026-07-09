import { Injectable } from '@nestjs/common';
import { INotifierManagerService } from 'src/bussiness/ports/output/services/i-notifier-manager.service';
import { INotifierService } from 'src/bussiness/ports/output/services/i-notifier.service';
import { MeasurementQueueService } from './measurement-queue.service';

@Injectable()
export class NotifierManagerService implements INotifierManagerService {
  private readonly notifiers: Record<'MeasurementQueue', INotifierService>;

  constructor(private readonly measurementQueueService: MeasurementQueueService) {
    this.notifiers = { MeasurementQueue: this.measurementQueueService };
  }

  getNotifierService(notifier: 'MeasurementQueue'): INotifierService {
    return this.notifiers[notifier];
  }
}
