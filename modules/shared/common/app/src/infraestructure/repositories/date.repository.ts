import { DateType, IDateRepository } from '../../application/contracts/date.contract';
import { DayJsAdapter } from '../adapters/day-js.adapter';

export class DateRepository implements IDateRepository {
  public getUnixMilliseconds(date?: DateType) {
    return DayJsAdapter.getUnixMilliseconds(date);
  }

  getUnixSeconds(date?: DateType) {
    const timestamp = this.getUnixMilliseconds(date);

    return Math.round(timestamp / 1000);
  }

  public getSortableDateFormat(date?: DateType) {
    return DayJsAdapter.getUTCDateInSortableFormat(date);
  }

  public addMonths(months: number, date?: DateType) {
    return DayJsAdapter.add(date, months, 'month');
  }
}
