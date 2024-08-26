import { JsonPath, TaskInput } from 'aws-cdk-lib/aws-stepfunctions';
import { LambdaInvoke, LambdaInvokeProps } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { camelCase } from 'change-case-all';
import { Construct } from 'constructs';
import { ControllerClassType } from '../../../../src/infraestructure/controllers/base.controller';

interface LambdaInvokeTaskProps extends Omit<LambdaInvokeProps, 'payload'> {
  payload: {
    controller: ControllerClassType;
    methodName: string;
    input?: Record<string, any> | string;
  };
}

export class LambdaInvokeTask extends LambdaInvoke {
  constructor(scope: Construct, id: string, props: LambdaInvokeTaskProps) {
    const method = (props.payload.controller as any)[props.payload.methodName];

    if (!method)
      throw new Error(
        `Method [${props.payload.methodName}] not found in controller [${props.payload.controller.name}]`
      );

    super(scope, id, {
      retryOnServiceExceptions: false,
      ...props,
      payload: TaskInput.fromObject({
        controller: props.payload.controller.name,
        methodName: props.payload.methodName,
        input: props.payload.input,
        metadata: {
          stateMachine: JsonPath.stateMachineName,
          executionId: JsonPath.executionName,
          lambdaStateName: JsonPath.stateName,
          payload: JsonPath.entirePayload,
        },
      }),
    });
  }

  private static contextStep(
    stepName: string,
    path: string | undefined,
    paramType: 'input' | 'output'
  ) {
    const step = camelCase(stepName);

    if (!path) return `$.context.${step}.${paramType}`;

    return `$.context.${step}.${paramType}.${path}`;
  }

  public static getInputPath = (stepName: string, path?: string) =>
    LambdaInvokeTask.contextStep(stepName, path, 'input');

  public static getOutputPath = (stepName: string, path?: string) =>
    LambdaInvokeTask.contextStep(stepName, path, 'output');
}
