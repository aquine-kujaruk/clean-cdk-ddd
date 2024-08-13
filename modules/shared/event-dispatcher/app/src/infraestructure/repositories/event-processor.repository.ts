import { AwsLambdaAdapter } from '@modules/common/app/src/infraestructure/adapters/aws-lambda.adapter';
import { AwsStepFunctionAdapter } from '@modules/common/app/src/infraestructure/adapters/aws-state-function.adapter';
import {
  IEventProcessorRepository,
  InvokeHandlerPayload,
} from '../../domain/contracts/event-processor.contract';

export class EventProcessorRepository implements IEventProcessorRepository {
  async invokeHandler(target: string, payload: InvokeHandlerPayload): Promise<void> {
    if (!target) throw new Error('Target is required, please set the proper environment variable');

    const controller = payload.controller.name;

    await AwsLambdaAdapter.invokeLambdaAsync(target, { ...payload, controller });
  }

  async invokeUseCase(target: string, payload: { body: Record<string, any> }): Promise<void> {
    if (!target) throw new Error('Target is required, please set the proper environment variable');

    await AwsStepFunctionAdapter.startExecutionAsync(target, payload);
  }
}