import { EditLocationInput } from './edit-location.input';

export class EditSubscriberInput {
  location?: EditLocationInput;

  constructor(
    public externalId?: string,
    public name?: string,
    public provider?: string,
    longitude?: number,
    latitude?: number,
    public notifier?: string,
  ) {
    this.location =
      latitude !== undefined || longitude !== undefined
        ? new EditLocationInput(longitude, latitude)
        : undefined;
  }
}
