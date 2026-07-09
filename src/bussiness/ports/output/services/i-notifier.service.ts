import { Subscriber } from 'src/bussiness/entities/subscriber.entity';
import { MeasurementOutput } from './dtos/output/measurement.output';

export abstract class INotifierService {
  abstract notify(subscriber: Subscriber, measurementOutput: MeasurementOutput): Promise<void>;
}
