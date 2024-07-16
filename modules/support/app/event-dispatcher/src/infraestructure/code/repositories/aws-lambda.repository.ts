import { LambdaConstructType } from '@modules/shared/app/lib/helpers/construct.types';
import { AwsLambdaAdapter } from '@modules/shared/app/src/infraestructure/adapters/aws-lambda.adapter';

export class AwsLambdaRepository {
  async invokeLambdaAsync(target: LambdaConstructType, payload:  Record<string, any>): Promise<void> {
    await AwsLambdaAdapter.invokeLambdaAsync(target.name, payload);
  }
}
