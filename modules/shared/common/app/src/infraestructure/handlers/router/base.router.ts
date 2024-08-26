import { ControllerClassType } from '../../controllers/base.controller';

export interface HandlerProps {
  controller: string;
  methodName: string;
  input: Record<string, any>;
}

export class BaseRouter {
  constructor(
    protected readonly props: HandlerProps,
    protected readonly controllers: ControllerClassType[]
  ) {}

  async route(): Promise<any> {
    const output = await this.execute(this.props.input);
    return JSON.stringify(output);
  }

  protected async execute(input: Record<string, any>) {
    const { controller, methodName } = this.props;
    console.log('execute: ', input, controller, methodName);

    const controllerMap = this.createControllerMap();

    const targetController: Record<string, any> = controllerMap[controller];
    if (!targetController) throw new Error('Controller not found');

    const targetMethod: (input: any) => any = targetController[methodName];
    if (!targetMethod) throw new Error('Method not found');

    return targetMethod(input);
  }

  private createControllerMap() {
    return this.controllers.reduce((acc: Record<string, ControllerClassType>, val) => {
      acc[val.name] = val;
      return acc;
    }, {});
  }
}
