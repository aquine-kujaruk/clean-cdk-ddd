import {
  AttributeValue,
  ConditionCheck,
  Delete,
  DynamoDBClient,
  Put,
  QueryCommand,
  TransactWriteItem,
  Update,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommandInput as LibPutCommandInput,
  PutCommand,
  PutCommandOutput,
  QueryCommandInput,
  TransactWriteCommand,
  UpdateCommand,
  UpdateCommandInput,
  UpdateCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { NativeAttributeValue, unmarshall } from '@aws-sdk/util-dynamodb';
import { EntityClassType } from '../../domain/entities/base.entity';
import { DateRepository } from '../repositories/date.repository';

type PutItemType = Record<string, NativeAttributeValue> & {
  PK: string;
  SK: string;
  ENTITIES: EntityClassType[];
};

type PutCommandInput = LibPutCommandInput & {
  Item: PutItemType;
};

type TransactItemsType = Omit<TransactWriteItem, 'ConditionCheck' | 'Put' | 'Delete' | 'Update'> & {
  ConditionCheck?: Omit<ConditionCheck, 'Key' | 'ExpressionAttributeValues'> & {
    Key: Record<string, NativeAttributeValue>;
    ExpressionAttributeValues?: Record<string, NativeAttributeValue>;
  };
  Put?: Omit<Put, 'Item' | 'ExpressionAttributeValues'> & {
    Item: PutItemType;
    ExpressionAttributeValues?: Record<string, NativeAttributeValue>;
  };
  Delete?: Omit<Delete, 'Key' | 'ExpressionAttributeValues'> & {
    Key: Record<string, NativeAttributeValue>;
    ExpressionAttributeValues?: Record<string, NativeAttributeValue>;
  };
  Update?: Omit<Update, 'Key' | 'ExpressionAttributeValues'> & {
    Key: Record<string, NativeAttributeValue>;
    ExpressionAttributeValues?: Record<string, NativeAttributeValue>;
  };
};

type TransactWriteCommandInput = {
  TransactItems: TransactItemsType[];
};

const client = new DynamoDBClient();
const documentClient = DynamoDBDocumentClient.from(client);

export class AwsDynamoDbAdapter {
  static async upsertItem(input: PutCommandInput): Promise<PutCommandOutput> {
    const commandInput = this.transformPutInput(input);
    const command = new PutCommand(commandInput);

    return documentClient.send(command);
  }

  static async updateItem(input: UpdateCommandInput): Promise<UpdateCommandOutput> {
    const command = new UpdateCommand(this.transformUpdateInput(input));

    return documentClient.send(command);
  }

  static async transactWriteItems(input: TransactWriteCommandInput) {
    const command = new TransactWriteCommand({
      ...input,
      TransactItems: input.TransactItems.map((item: TransactItemsType) => {
        if (item.Put)
          return {
            Put: this.transformPutInput(item.Put),
          };

        if (item.Update) {
          return {
            Update: this.transformUpdateInput(item.Update),
          };
        }

        return item;
      }),
    });

    return documentClient.send(command);
  }

  static async paginatedQuery(
    input: QueryCommandInput,
    results: Record<string, AttributeValue>[] = []
  ): Promise<Record<string, NativeAttributeValue>[]> {
    const { Items, LastEvaluatedKey } = await documentClient.send(new QueryCommand(input));

    if (Items) results.push(...Items);

    if (LastEvaluatedKey)
      return this.paginatedQuery({ ...input, ExclusiveStartKey: LastEvaluatedKey }, results);

    return results.map((item) => unmarshall(item));
  }

  private static getTimestamp() {
    const dateRepository = new DateRepository();
    return dateRepository.getSortableDateFormat();
  }

  private static transformPutInput(input: PutCommandInput) {
    const timestamp = this.getTimestamp();

    return {
      ...input,
      Item: {
        ...input.Item,
        ENTITIES: input.Item.ENTITIES.map(({ name }) => name).join('|'),
        updatedAtUTC: timestamp,
        createdAtUTC: timestamp,
      },
    };
  }

  private static transformUpdateInput(input: UpdateCommandInput) {
    const timestamp = this.getTimestamp();

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
      ':updatedAtUTC': timestamp,
    };

    return {
      ...input,
      UpdateExpression: updatedExpression,
      ExpressionAttributeNames: updatedNames,
      ExpressionAttributeValues: updatedValues,
    };
  }
}
