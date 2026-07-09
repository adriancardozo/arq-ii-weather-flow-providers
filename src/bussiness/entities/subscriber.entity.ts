import { EditSubscriberInput } from '../ports/input/services/dtos/input/edit-subscriber.input';
import { Location } from '../value-objects/location.value-object';
import { IEntity } from './i.entity';

export class Subscriber extends IEntity<EditSubscriberInput> {
  externalId: string;
  name: string;
  provider: string;
  location: Location;
  notifier: string;

  constructor(id: string);
  constructor(
    id: string,
    externalId: string,
    name: string,
    provider: string,
    location: Location,
    notifier: string,
  );
  constructor(
    id: string,
    externalId?: string,
    name?: string,
    provider?: string,
    location?: Location,
    notifier?: string,
  ) {
    super();
    this.id = id;
    if (externalId && name && provider && location && notifier) {
      this.externalId = externalId;
      this.name = name;
      this.provider = provider;
      this.location = location;
      this.notifier = notifier;
    }
  }

  edit({ externalId, name, provider, location, notifier }: EditSubscriberInput): void {
    this.externalId = externalId ?? this.externalId;
    this.name = name ?? this.name;
    this.provider = provider ?? this.provider;
    this.notifier = notifier ?? this.notifier;
    if (location) this.location.edit(location);
  }
}
