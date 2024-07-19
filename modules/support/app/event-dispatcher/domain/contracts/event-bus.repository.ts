import { AppEventValueObject } from '../value-objects/app-event.value-object';

export interface EventBusRepository {
  sendAppEvent(event: AppEventValueObject): Promise<void>;
}
