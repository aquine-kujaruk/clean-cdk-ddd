import { DayJsAdapter } from '@modules/shared/app/src/infraestructure/adapters/day-js.adapter';
import { DateRepository } from '../../domain/contracts/date.repository';

export class DayJsRepository implements DateRepository {
  public getUnixMilliseconds() {
    return DayJsAdapter.getUnixMilliseconds();
  }

  public getDynamoDbFriendlyTimestamp() {
    return DayJsAdapter.getDynamoDbFriendlyTimestamp();
  }
}
