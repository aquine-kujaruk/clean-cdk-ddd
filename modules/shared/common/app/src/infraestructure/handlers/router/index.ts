import { ControllerClassType } from '../../controllers/base.controller';
import { BaseRouter, HandlerProps } from './base.router';
import { LambdaSfnTaskRouter } from './lambda-sfn-task.router';
import { MapSfnTaskRouter } from './map-sfn-task.router';
import { ParallelSfnTaskRouter } from './parallel-sfn-task.router';
import { SfnHandlerProps } from './base-sfn-task.router';

export class Router {
  private readonly router: new (...args: any[]) => BaseRouter;

  constructor(
    private readonly props: HandlerProps | SfnHandlerProps,
    private readonly controllers: ControllerClassType[]
  ) {
    const { metadata } = props as SfnHandlerProps;
    const { lambdaStateName, parallelTaskName, mapTaskName } = metadata || {};

    switch (true) {
      case !!lambdaStateName:
        this.router = LambdaSfnTaskRouter;
        break;

      case !!parallelTaskName:
        this.router = ParallelSfnTaskRouter;
        break;

      case !!mapTaskName:
        this.router = MapSfnTaskRouter;
        break;

      default:
        this.router = BaseRouter;
        break;
    }
  }

  route() {
    return new this.router(this.props, this.controllers).route();
  }
}
