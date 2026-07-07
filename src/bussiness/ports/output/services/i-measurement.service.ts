import { RegisterMeasurementInput } from './dtos/input/register-measurement.input';

export abstract class IMeasurementService {
  abstract sendToCreate(measurementInput: RegisterMeasurementInput): Promise<void>;
}
