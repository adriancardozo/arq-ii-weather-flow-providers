import { BussinessError } from './bussiness.error';

export class SubscriberNotFoundError extends BussinessError {
  constructor(message?: string, options?: ErrorOptions) {
    super(message ?? 'Suscriptor no encontrado.', options);
  }
}
