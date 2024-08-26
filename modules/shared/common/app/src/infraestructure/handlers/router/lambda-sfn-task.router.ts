import { ControllerClassType } from '../../controllers/base.controller';
import { ISfnTaskRouter, SfnHandlerProps, SfnTaskRouter } from './base-sfn-task.router';

export class LambdaSfnTaskRouter extends SfnTaskRouter implements ISfnTaskRouter {
  constructor(props: SfnHandlerProps, controllers: ControllerClassType[]) {
    super(props, controllers);
  }

  async route() {
    const { input, metadata } = this.props;
    const { payload } = metadata || {};

    return {
      context: {
        ...(payload?.context || {}),
        [this.transformStateName(metadata.lambdaStateName)]: {
          input: input,
          output: await this.execute(input || payload),
        },
      },
    };
  }
}
