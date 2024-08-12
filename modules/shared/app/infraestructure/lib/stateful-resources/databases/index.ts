import { NestedStack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Configurations } from '../../../../../configurations';
import { BookTable } from './dynamo-db/book.table';
import { EventStoreTable } from './dynamo-db/event-store.table';

export class DynamoDb extends NestedStack {
  constructor(scope: Construct) {
    super(scope, Configurations.getStaticStackName(DynamoDb.name));
    new EventStoreTable(this);
    new BookTable(this);
  }
}
