import { AppEvents } from '../../../infraestructure/app.events';
import { EventInput } from '../../../infraestructure/event-input.type';

export interface IEventRepository {
  saveEventIfUnique(data: EventInput<typeof AppEvents>, referenceKeys: string[]): Promise<void>;
}
