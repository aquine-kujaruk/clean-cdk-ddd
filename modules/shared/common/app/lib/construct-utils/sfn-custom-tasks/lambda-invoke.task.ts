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
    initializeContext?: boolean; // La primera task de un parallel o map debe inicializar el contexto
    context?: Record<never, never>;
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
      context: JsonPath.objectAt('$.context'),
      stateName: JsonPath.stateName,
      ...props.payload,
      controller: props.payload.controller.name,
    };

    if (props.payload.initializeContext) {
      const { context, ...rest } = payload;
      payload = { ...rest, context: {} };
    }

    // Se revisa el input por que se supone que viene vacío luego de un map o un parallel
    if (!props.payload.initializeContext && !payload.input) {
      const { context, input, ...rest } = payload;
      payload = { ...rest, context: {}, input: JsonPath.objectAt('$') };
    }

    super(scope, id, {
      retryOnServiceExceptions: false,
      ...props,
      payload: TaskInput.fromObject(payload)
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
