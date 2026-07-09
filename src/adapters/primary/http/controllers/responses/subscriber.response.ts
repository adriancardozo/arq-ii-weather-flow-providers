import { ApiProperty } from '@nestjs/swagger';
import { LocationResponse } from './location.response';
import { Subscriber } from 'src/bussiness/entities/subscriber.entity';

export class SubscriberResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  external_id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  provider: string;
  @ApiProperty({ type: LocationResponse })
  location: LocationResponse;
  @ApiProperty()
  notifier: string;

  constructor(subscriber: Subscriber) {
    this.id = subscriber.id!;
    this.external_id = subscriber.externalId;
    this.name = subscriber.name;
    this.provider = subscriber.provider;
    this.location = new LocationResponse(subscriber.location);
    this.notifier = subscriber.notifier;
  }
}
