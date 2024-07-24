import { AppEventValueObject } from "../../../domain/src/value-objects/app-event.value-object";

export interface IEventDispatcherRepository {
  sendAppEvent(event: AppEventValueObject): Promise<void>;
}
