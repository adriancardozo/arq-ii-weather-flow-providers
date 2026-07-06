export abstract class IProviderService {
  abstract synchronizeProviders(): Promise<void>;
}
