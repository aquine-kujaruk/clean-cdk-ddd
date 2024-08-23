import { Construct } from "constructs";
import { EventStoreTable } from "./tables/event-store.table";
import { BookTable } from "./tables/book.table";

export class DynamoDb {
    constructor(scope: Construct) {
      new EventStoreTable(scope);
      new BookTable(scope);
    }
  }