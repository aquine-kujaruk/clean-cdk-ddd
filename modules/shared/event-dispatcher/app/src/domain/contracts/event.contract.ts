import { AppEvents } from '../../../app.events';
import { EventInput } from '../../../event-input.type';

export interface IEventRepository {
  saveEventIfUnique(data: EventInput<typeof AppEvents>, referenceKeys: string[]): Promise<void>;
}
