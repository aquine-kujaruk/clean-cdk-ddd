import { JsonPath, TaskInput } from 'aws-cdk-lib/aws-stepfunctions';
import { LambdaInvoke, LambdaInvokeProps } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { camelCase } from 'change-case-all';
import { Construct } from 'constructs';
import { ControllerClassType } from '../../../src/infraestructure/controllers/base.controller';

interface LambdaInvokeTaskProps extends Omit<LambdaInvokeProps, 'payload'> {
  payload: {
    controller: ControllerClassType;
    methodName: string;
    input?: Record<string, any>;
    initializeContext?: boolean;
    context?: {
      execution: Record<never, never>;
      previousStep: Record<never, never>;
    };
  };
}

export class LambdaInvokeTask extends LambdaInvoke {
  constructor(scope: Construct, id: string, props: LambdaInvokeTaskProps) {
    const method = (props.payload.controller as any)[props.payload.methodName];

    if (!method)
      throw new Error(
        `Method [${props.payload.methodName}] not found in controller [${props.payload.controller.name}]`
      );

    let payload = {
      context: {
        execution: JsonPath.objectAt('$.context.execution'),
        previousStep: JsonPath.objectAt('$.context.previousStep'),
      },
      stateName: JsonPath.stateName,
      ...props.payload,
      controller: props.payload.controller.name,
    };

    if (props.payload.initializeContext) {
      const { context, ...rest } = payload;
      payload = {
        ...rest,
        context: { execution: {}, previousStep: {} },
      };
    }

    super(scope, id, {
      retryOnServiceExceptions: false,
      ...props,
      payload: TaskInput.fromObject(payload),
    });
  }

  public static readonly previousStepInput = '$.context.previousStep.input';
  public static readonly previousStepOutput = '$.context.previousStep.output';

  private static executionStep(
    stepName: string,
    path: string | undefined,
    paramType: 'input' | 'output'
  ) {
    const step = camelCase(stepName);

    if (!path) return `$.context.execution.${step}.${paramType}`;

    return `$.context.execution.${step}.${paramType}.${path}`;
  }

  public static executionStepInput = (stepName: string, path?: string) =>
    LambdaInvokeTask.executionStep(stepName, path, 'input');

  public static executionStepOutput = (stepName: string, path?: string) =>
    LambdaInvokeTask.executionStep(stepName, path, 'output');
}
