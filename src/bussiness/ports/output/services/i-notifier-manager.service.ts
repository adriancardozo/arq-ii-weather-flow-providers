import { INotifierService } from './i-notifier.service';

export abstract class INotifierManagerService {
  abstract getNotifierService(notifier: string): INotifierService;
}
