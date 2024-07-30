import { DayJsAdapter } from '@modules/shared/app/infraestructure/src/adapters/day-js.adapter';
import { IDateRepository } from '../../../application/src/contracts/date.contract';

export class DateRepository implements IDateRepository {
  public getUnixMilliseconds() {
    return DayJsAdapter.getUnixMilliseconds();
  }

  public getDynamoDbFriendlyTimestamp() {
    return DayJsAdapter.getDynamoDbFriendlyTimestamp();
  }
}
