import { JsonPath, TaskInput } from 'aws-cdk-lib/aws-stepfunctions';
import { ControllerClassType } from '../infraestructure/controllers/base.controller';

interface LambdaTaskInputProps {
  controller: ControllerClassType;
  methodName: string;
  input?: string | Record<string, any>;
  executionStack?: Record<never, never>;
  previousStep?: Record<never, never>;
}

export class LambdaTaskInput {
  static fromObject(props: LambdaTaskInputProps): TaskInput {
    if (!props.methodName.length || (props.controller as any)[props.methodName] === undefined)
      throw new Error(`Method [${props.methodName}] not found in controller [${props.controller.name}]`);

    return TaskInput.fromObject({
      executionStack: JsonPath.objectAt('$.executionStack'),
      previousStep: JsonPath.objectAt('$.previousStep'),
      stateName: JsonPath.stateName,
      ...props,
      controller: props.controller.name,
    });
  }
}
