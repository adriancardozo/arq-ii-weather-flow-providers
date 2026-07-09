import { Location } from 'src/bussiness/value-objects/location.value-object';
import { MeasurementOutput } from './dtos/output/measurement.output';

export abstract class IWeatherProviderService {
  abstract measure(location: Location): Promise<MeasurementOutput>;
}
