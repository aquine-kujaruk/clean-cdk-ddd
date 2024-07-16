import dayjs from 'dayjs';

export class DayJsAdapter {
  static getTimestamp(date = Date.now()): string {
    return dayjs(date).toISOString();
  }
}