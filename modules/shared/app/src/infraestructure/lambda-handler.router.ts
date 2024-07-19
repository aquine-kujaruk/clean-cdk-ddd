import { camelCase } from 'change-case-all';
import { ServiceClassType } from './services/base.service';

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
    
    const output = await this.execute();
    
    if (!this.props.stateName) return output;

    // StateMachine execution
    const { input, context, stateName } = this.props;

    const previousStep = { input, output };


    return {
      context: {
        previousStep,
        execution: { ...context.execution, [camelCase(stateName)]: previousStep },
      },
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
