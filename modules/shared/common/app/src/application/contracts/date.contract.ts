export type DateType = Date | number | string;

export interface IDateRepository {
  getUnixMilliseconds(date?: DateType): number;
  getUnixSeconds(date?: DateType): number;
  getSortableDateFormat(date?: DateType): string;
  addMonths(months: number, date?: DateType): Date;
}
