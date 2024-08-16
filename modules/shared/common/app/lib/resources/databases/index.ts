import { Construct } from 'constructs';
import { BookTable } from './dynamo-db/book.table';
import { EventStoreTable } from './dynamo-db/event-store.table';

export class DynamoDb {
  constructor(scope: Construct) {
    new EventStoreTable(scope);
    new BookTable(scope);
  }
}
