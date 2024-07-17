import { AwsStepFunctionAdapter } from '@modules/shared/app/src/infraestructure/adapters/aws-state-function.adapter';

export class AwsStepFunctionRepository {
  async invokeAsyncExecution(target: string, payload: Record<string, any>): Promise<void> {
    await AwsStepFunctionAdapter.startExecutionAsync(target, payload);
  }
}
