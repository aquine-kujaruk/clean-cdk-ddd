import { camelCase } from 'change-case-all';
import { ControllerClassType } from './controllers/base.controller';

export type HandlerRoutesType<Key extends string, Base> = {
  [key in Key]: new (...args: any[]) => Base;
};

interface StateMachineExecutionProps {
  context?: {
    execution: {
      [key in string]: {
        input: Record<string, any>;
        output: Record<string, any>;
      };
    };
  };
  stateName?: string;
}

export interface HandlerProps extends StateMachineExecutionProps {
  controller: string;
  methodName: string;
  input: Record<string, any>;
}

export class ControllerRouter {
  constructor(
    private readonly props: HandlerProps,
    private readonly controllers: ControllerClassType[]
  ) {}

  async route() {
    const output = await this.execute();

    if (!this.props.stateName) return JSON.stringify(output);

    // StateMachine execution
    const { input, context, stateName } = this.props;

    const previousStep = { input, output };

    return {
      context: {
        previousStep,
        execution: { ...context?.execution, [camelCase(stateName)]: previousStep },
      },
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
