import { LocationInput } from '../../input/services/dtos/input/location.input';
import { RegisterMeasurementInput } from './dtos/input/register-measurement.input';

export abstract class IWeatherProviderService {
  abstract measure(station: string | null, location: LocationInput): Promise<RegisterMeasurementInput>;
}
