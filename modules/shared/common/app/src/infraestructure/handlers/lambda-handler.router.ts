import { camelCase } from 'change-case-all';
import { ControllerClassType } from '../controllers/base.controller';

export type HandlerRoutesType<Key extends string, Base> = {
  [key in Key]: new (...args: any[]) => Base;
};

interface StateMachineExecutionProps {
  context?: {
    [key in string]: {
      input: Record<string, any>;
      output: Record<string, any>;
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
    if (this.props.stateName) return this.handleStateMachineOutput(); // Handle State Machine Lambda Invocation

    const output = await this.execute(this.props.input);
    return JSON.stringify(output);
  }

  private async handleStateMachineOutput() {
    const { payload, parallelTaskName, mapTaskName } = this.props.input;

    if (parallelTaskName) {
      const stateName = camelCase(parallelTaskName);
      let ctx: any = {};

      payload.forEach(({ context }: { context: Record<string, any> }, index: number) => {
        const stepKey = Object.keys(context).pop() as string;
        const step = context[stepKey];

        if (index === 0) {
          delete context[stepKey];

          ctx = { ...context, [stateName]: { input: step.input } };
        }

        ctx = {
          ...ctx,
          [stateName]: {
            ...ctx[stateName],
            output: {
              ...ctx[stateName].output,
              [stepKey]: step.output,
            },
          },
        };
      });

      return { context: ctx };
    }

    if (mapTaskName) {
      const stateName = camelCase(mapTaskName);
      let ctx: any = {};

      payload.forEach(({ context }: { context: Record<string, any> }, index: number) => {
        const stepKey = Object.keys(context).pop() as string;
        const step = context[stepKey];

        if (index === 0) {
          delete context[stepKey];

          ctx = { ...context, [stateName]: { output: [] } };
        }

        ctx[stateName].output.push(step.output);
      });

      return { context: ctx };
    }

    return {
      context: {
        ...this.props.context,
        [camelCase(this.props.stateName as string)]: {
          input: this.props.input,
          output: await this.execute(this.props.input),
        },
      },
    };
  }

  private async execute(input: Record<string, any>) {
    const { controller, methodName: method } = this.props;

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
