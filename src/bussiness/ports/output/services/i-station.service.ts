import { SynchronizeProviderInput } from '../../input/services/dtos/input/synchronize-provider.input';

export abstract class IStationService {
  abstract findWithProvider(): Promise<Array<SynchronizeProviderInput>>;
}
