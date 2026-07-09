import { Subscriber } from 'src/bussiness/entities/subscriber.entity';
import { CreateSubscriberInput } from './dtos/input/create-subscriber.input';
import { EditSubscriberInput } from './dtos/input/edit-subscriber.input';
import { EditExternalSubscriberInput } from './dtos/input/edit-external-subscriber.input';

export abstract class ISubscriberService {
  abstract getAll(): Promise<Array<Subscriber>>;

  abstract getById(id: string): Promise<Subscriber>;

  abstract edit(id: string, input: EditSubscriberInput): Promise<Subscriber>;

  abstract delete(id: string): Promise<Subscriber>;

  abstract create(input: CreateSubscriberInput): Promise<Subscriber>;

  abstract synchronizeSubscribers(): Promise<void>;

  abstract deleteExternal(externalId: string): Promise<Subscriber>;

  abstract editExternal(input: EditExternalSubscriberInput): Promise<Subscriber>;
}
