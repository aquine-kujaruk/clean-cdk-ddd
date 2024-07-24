import { AttributeValue, DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandInput,
  PutCommandOutput,
  QueryCommandInput,
  UpdateCommand,
  UpdateCommandInput,
  UpdateCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { DateRepository } from '../repositories/date.repository';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient();
const documentClient = DynamoDBDocumentClient.from(client);

export class AwsDynamoDbAdapter {
  private static getTimestamp() {
    const dateRepository = new DateRepository();
    const updatedAtUTC = dateRepository.getDynamoDbFriendlyTimestamp();
    const createdAtUTC = updatedAtUTC;

    return { updatedAtUTC, createdAtUTC };
  }

  static async upsertItem(input: PutCommandInput): Promise<PutCommandOutput> {
    const { updatedAtUTC, createdAtUTC } = this.getTimestamp();

    const command = new PutCommand({
      ...input,
      Item: {
        ...input.Item,
        updatedAtUTC,
        createdAtUTC,
      },
    });

    return documentClient.send(command);
  }

  static async updateItem(input: UpdateCommandInput): Promise<UpdateCommandOutput> {
    const { updatedAtUTC } = this.getTimestamp();

    const { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = input;

    const updatedExpression = UpdateExpression
      ? `${UpdateExpression}, #updatedAtUTC = :updatedAtUTC`
      : 'SET #updatedAtUTC = :updatedAtUTC';

    const updatedNames = {
      ...ExpressionAttributeNames,
      '#updatedAtUTC': 'updatedAtUTC',
    };

    const updatedValues = {
      ...ExpressionAttributeValues,
      ':updatedAtUTC': updatedAtUTC,
    };

    const command = new UpdateCommand({
      ...input,
      UpdateExpression: updatedExpression,
      ExpressionAttributeNames: updatedNames,
      ExpressionAttributeValues: updatedValues,
    });

    return documentClient.send(command);
  }

  static async paginatedQuery(
    input: QueryCommandInput,
    results: Record<string, AttributeValue>[] = []
  ): Promise<Record<string, any>[]> {
    const { Items, LastEvaluatedKey } = await documentClient.send(new QueryCommand(input));

    if (Items) results.push(...Items);

    if (LastEvaluatedKey)
      return this.paginatedQuery({ ...input, ExclusiveStartKey: LastEvaluatedKey }, results);

    return results.map(item => unmarshall(item));
  }
}
