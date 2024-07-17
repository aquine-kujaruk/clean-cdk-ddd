import { DayJsAdapter } from '@modules/shared/app/src/infraestructure/adapters/day-js.adapter';
import { DateRepository } from '../../../domain/src/contracts/date.repository';

export class DayJsRepository implements DateRepository {
  public getTimestamp() {
    return DayJsAdapter.getTimestamp();
  }
}
