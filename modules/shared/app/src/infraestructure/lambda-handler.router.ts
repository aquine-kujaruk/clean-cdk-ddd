import { camelCase } from 'change-case-all';
import { ServiceClassType } from './services/base.service';

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
  service: string;
  methodName: string;
  input: Record<string, any>;
}

export class LambdaHandlerRouter {
  constructor(
    private readonly props: LambdaHandlerProps,
    private readonly services: ServiceClassType[]
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
    const { service, methodName: method, input } = this.props;

    const serviceMap = this.createServiceMap();

    const targetService: any = serviceMap[service];
    if (!targetService) throw new Error('Service not found');

    const targetMethod: any = targetService[method];
    if (!targetMethod) throw new Error('Method not found');

    return targetMethod(input);
  }

  private createServiceMap() {
    return this.services.reduce((acc: Record<string, ServiceClassType>, val) => {
      acc[val.name] = val;
      return acc;
    }, {});
  }
}
