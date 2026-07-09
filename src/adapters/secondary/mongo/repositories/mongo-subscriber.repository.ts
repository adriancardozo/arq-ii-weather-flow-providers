import { MongoRepository } from './mongo.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoTransactionService } from '../services/mongo-transaction.service';
import { Subscriber } from 'src/bussiness/entities/subscriber.entity';
import { CreateSubscriberInput } from 'src/bussiness/ports/input/services/dtos/input/create-subscriber.input';
import { EditSubscriberInput } from 'src/bussiness/ports/input/services/dtos/input/edit-subscriber.input';
import { ISubscriberRepository } from 'src/bussiness/ports/output/repositories/i-subscriber.repository';
import { Subscriber as SubscriberObject } from '../schemas/object/subscriber-object.schema';
import { SubscriberNotFoundError } from 'src/bussiness/errors/subscriber-not-found.error';

export class MongoSubscriberRepository
  extends MongoRepository<Subscriber, CreateSubscriberInput, EditSubscriberInput>
  implements ISubscriberRepository
{
  constructor(
    @InjectModel(Subscriber.name) SubscriberModel: Model<Subscriber>,
    transactionService: MongoTransactionService,
  ) {
    super(SubscriberObject, Subscriber, SubscriberNotFoundError, SubscriberModel, transactionService, []);
  }
}
