import { IDateRepository } from "../../application/contracts/date.contract";
import { DayJsAdapter } from "../adapters/day-js.adapter";

export class DateRepository implements IDateRepository {
  public getUnixMilliseconds() {
    return DayJsAdapter.getUnixMilliseconds();
  }

  public getDynamoDbFriendlyTimestamp() {
    return DayJsAdapter.getDynamoDbFriendlyTimestamp();
  }
}
