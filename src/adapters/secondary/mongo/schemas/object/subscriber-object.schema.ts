import { Type } from 'class-transformer';
import { Location } from 'src/bussiness/value-objects/location.value-object';
import { Subscriber as SubscriberEntity } from 'src/bussiness/entities/subscriber.entity';

export class Subscriber extends SubscriberEntity {
  @Type(() => Location)
  declare location: Location;
}
