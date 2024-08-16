import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export class DayJsAdapter {
  static getUnixMilliseconds(date: dayjs.ConfigType): number {
    return dayjs(date).valueOf();
  }

  static getUTCDateInSortableFormat(date: dayjs.ConfigType): string {
    return dayjs(date).utc().format('YYYY-MM-DD HH:mm:ss');
  }

  static add(date: dayjs.ConfigType, value: number, unit?: dayjs.ManipulateType): Date {
    return dayjs(date).add(value, unit).toDate();
  }
}
