import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';

const lambdaClient = new LambdaClient();

export class AwsLambdaAdapter {
  static async invokeLambdaAsync<T>(FunctionName: string, payload: T): Promise<void> {
    const command = new InvokeCommand({
      FunctionName,
      Payload: JSON.stringify(payload),
      InvocationType: 'Event',
    });

    try {
      const response = await lambdaClient.send(command);

      console.log(
        'State machine invoked successfully',
        JSON.stringify({ FunctionName, payload, statusCode: response.StatusCode }, null, 2)
      );
    } catch (error) {
      console.error(
        'Error invoking lambda function:',
        JSON.stringify({ FunctionName, payload }, null, 2),
        error
      );
      throw error;
    }
  }
}
