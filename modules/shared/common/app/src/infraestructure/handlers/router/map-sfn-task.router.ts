import { ControllerClassType } from '../../controllers/base.controller';
import { ISfnTaskRouter, SfnHandlerProps, SfnTaskRouter } from './base-sfn-task.router';

export class MapSfnTaskRouter extends SfnTaskRouter implements ISfnTaskRouter {
  constructor(props: SfnHandlerProps, controllers: ControllerClassType[]) {
    super(props, controllers);
  }

  async route() {
    const { payload, mapTaskName } = this.props.metadata;
    const stateName = this.transformStateName(mapTaskName);
    let ctx: any = {};

    payload.forEach(({ context }: { context: Record<string, any> }, index: number) => {
      const stepKey = Object.keys(context).pop() as string;
      const step = context[stepKey];

      if (index === 0) {
        delete context[stepKey];

        ctx = { ...context, [stateName]: { output: [] } };
      }

      if (step.output) ctx[stateName].output.push(step.output);
    });

    return { context: ctx };
  }
}
