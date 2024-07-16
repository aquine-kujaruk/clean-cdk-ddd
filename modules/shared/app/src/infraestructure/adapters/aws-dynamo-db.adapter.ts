import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandInput,
  PutCommandOutput,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient();
const documentClient = DynamoDBDocumentClient.from(client);

export class AwsDynamoDbAdapter {
  static async upsertItem(input: PutCommandInput): Promise<PutCommandOutput> {
    const command = new PutCommand(input);

    return documentClient.send(command);
  }
}
