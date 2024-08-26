import { camelCase } from 'change-case-all';
import { ControllerClassType } from '../../controllers/base.controller';
import { BaseRouter, HandlerProps } from './base.router';

interface SfnTaskRouterResult {
  context: {
    [key: string]: {
      input: Record<string, any>;
      output: Record<string, any>;
    };
  };
}

export type SfnHandlerProps = HandlerProps &
  SfnTaskRouterResult & {
    metadata: {
      lambdaStateName?: string;
      parallelTaskName?: string;
      mapTaskName?: string;
      payload: Record<string, any>;
    };
  };

export interface ISfnTaskRouter {
  route(): Promise<SfnTaskRouterResult>;
}

export class SfnTaskRouter extends BaseRouter {
  constructor(protected readonly props: SfnHandlerProps, controllers: ControllerClassType[]) {
    super(props, controllers);
  }

  protected transformStateName(stateName: string | undefined) {
    return camelCase(stateName as string);
  }
}
