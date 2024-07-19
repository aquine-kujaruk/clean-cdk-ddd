import dayjs, { unix } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export class DayJsAdapter {
  static getUnixMilliseconds(date = Date.now()): number {
    return dayjs(date).utc().valueOf();
  }

  static getUnixSeconds(date = Date.now()): number {
    return dayjs(date).utc().unix();
  }

  static getDynamoDbFriendlyTimestamp(date = Date.now()): string {
    return dayjs(date).utc().format('YYYY-MM-DD HH:mm:ss');
  }
}
