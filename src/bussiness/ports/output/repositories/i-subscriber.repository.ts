import { CreateSubscriberInput } from '../../input/services/dtos/input/create-subscriber.input';
import { EditSubscriberInput } from '../../input/services/dtos/input/edit-subscriber.input';
import { IRepository } from './i.repository';
import { Subscriber } from 'src/bussiness/entities/subscriber.entity';

export abstract class ISubscriberRepository<Session = any> extends IRepository<
  Subscriber,
  CreateSubscriberInput,
  EditSubscriberInput,
  Session
> {}
