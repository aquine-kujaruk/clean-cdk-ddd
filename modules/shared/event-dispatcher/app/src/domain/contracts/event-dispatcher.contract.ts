import { AppEventValueObject } from "../value-objects/app-event.value-object";

export interface IEventDispatcherRepository {
  sendAppEvent(event: AppEventValueObject): Promise<void>;
}
