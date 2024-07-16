import { DateRepository } from '../../../domain/code/repositories/date.repository';
import { DayJsAdapter } from '@modules/shared/app/src/infraestructure/adapters/day-js.adapter';

export class DayJsRepository implements DateRepository {
  public getTimestamp() {
    return DayJsAdapter.getTimestamp();
  }
}
