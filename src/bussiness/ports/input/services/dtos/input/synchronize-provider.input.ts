import { LocationInput } from './location.input';

export class SynchronizeProviderInput {
  constructor(
    public provider: string,
    public station_id: string,
    public station_name: string,
    public location: LocationInput,
  ) {}
}
