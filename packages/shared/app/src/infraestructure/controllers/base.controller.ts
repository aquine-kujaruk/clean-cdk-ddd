export class BaseController {
  static _isController() {
    return BaseController;
  }
}

interface ControllerConditionalType {
  new (...args: any[]): any;
  _isController(): typeof BaseController;
}

type EnsureIsController<T> = T extends ControllerConditionalType ? T : never;

export type ControllerClassType = EnsureIsController<typeof BaseController>;