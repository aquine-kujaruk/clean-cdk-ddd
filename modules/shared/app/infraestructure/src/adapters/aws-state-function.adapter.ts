import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';

const client = new SFNClient();

export class AwsStepFunctionAdapter {
  static async startExecutionAsync(stateMachineArn: string, payload: Record<string, any>): Promise<void> {
    const command = new StartExecutionCommand({
      stateMachineArn,
      input: JSON.stringify(payload),
    });

    try {
      const response = await client.send(command);
      console.log(
        'State machine invoked successfully',
        JSON.stringify({ stateMachineArn, payload, execution: response.executionArn }, null, 2)
      );
    } catch (error) {
      console.error(
        'Error invoking state machine:',
        JSON.stringify({ stateMachineArn, payload }, null, 2),
        error
      );
      throw error;
    }
  }
}
