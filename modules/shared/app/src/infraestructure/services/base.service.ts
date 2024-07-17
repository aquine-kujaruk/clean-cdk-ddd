export class BaseService {
  static _isService() {
    return BaseService;
  }
}

interface ServiceConditionalType {
  new (...args: any[]): any;
  _isService(): typeof BaseService;
}

type EnsureIsService<T> = T extends ServiceConditionalType ? T : never;

export type ServiceClassType = EnsureIsService<typeof BaseService>;