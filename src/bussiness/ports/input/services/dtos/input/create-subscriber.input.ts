import { Location } from 'src/bussiness/value-objects/location.value-object';

export class CreateSubscriberInput {
  constructor(
    public externalId: string,
    public name: string,
    public provider: string,
    public location: Location,
    public notifier: string,
  ) {}
}
