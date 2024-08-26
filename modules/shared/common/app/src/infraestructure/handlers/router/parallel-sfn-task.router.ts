import { ControllerClassType } from '../../controllers/base.controller';
import { ISfnTaskRouter, SfnHandlerProps, SfnTaskRouter } from './base-sfn-task.router';

export class ParallelSfnTaskRouter extends SfnTaskRouter implements ISfnTaskRouter {
  constructor(props: SfnHandlerProps, controllers: ControllerClassType[]) {
    super(props, controllers);
  }

  async route() {
    const { payload, parallelTaskName } = this.props.metadata;
    const stateName = this.transformStateName(parallelTaskName);
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
            [stepKey]: step?.output || undefined,
          },
        },
      };
    });

    return { context: ctx };
  }
}
