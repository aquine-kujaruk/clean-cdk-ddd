import { JsonPath, TaskInput } from 'aws-cdk-lib/aws-stepfunctions';
import { ServiceClassType } from '../infraestructure/services/base.service';

interface LambdaTaskInputProps {
  service: ServiceClassType;
  methodName: string;
  input?: string | Record<string, any>;
  executionStack?: Record<never, never>;
  previousStep?: Record<never, never>;
}

export class LambdaTaskInput {
  static fromObject(props: LambdaTaskInputProps): TaskInput {
    if (!props.methodName.length || (props.service as any)[props.methodName] === undefined)
      throw new Error(`Method [${props.methodName}] not found in service [${props.service.name}]`);

    return TaskInput.fromObject({
      executionStack: JsonPath.objectAt('$.executionStack'),
      previousStep: JsonPath.objectAt('$.previousStep'),
      stateName: JsonPath.stateName,
      ...props,
      service: props.service.name,
    });
  }
}
