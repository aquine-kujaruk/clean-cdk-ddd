import { camelCase } from 'change-case-all';
import { ControllerClassType } from './controllers/base.controller';

export type HandlerRoutesType<Key extends string, Base> = {
  [key in Key]: new (...args: any[]) => Base;
};

interface StateMachineExecutionProps {
  executionStack?: {
    [key in string]: {
      input: Record<string, any>;
      output: Record<string, any>;
    };
  };
  stateName?: string;
}

export interface LambdaHandlerProps extends StateMachineExecutionProps {
  controller: string;
  methodName: string;
  input: Record<string, any>;
}

export class LambdaHandlerRouter {
  constructor(
    private readonly props: LambdaHandlerProps,
    private readonly controllers: ControllerClassType[]
  ) {}

  async route() {
    const { input, executionStack = {}, stateName } = this.props;
    console.log('this.props: ', this.props);

    const output = await this.execute();

    const previousStep = { input, output };

    if (!stateName) return output;

    return {
      previousStep,
      executionStack: { ...executionStack, [camelCase(stateName)]: previousStep },
    };
  }

  private async execute() {
    const { controller, methodName: method, input } = this.props;

    const controllerMap = this.createControllerMap();

    const targetController: any = controllerMap[controller];
    if (!targetController) throw new Error('Controller not found');

    const targetMethod: any = targetController[method];
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
