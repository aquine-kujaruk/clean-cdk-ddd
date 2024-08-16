import {
  DomainEventDetailType,
  HandlerConsumer,
  BaseDomainEvent,
  UseCaseConsumer,
} from '@modules/common/app/src/domain/events/base.domain-event';
import { DomainEventSources } from '../../../domain-event.sources';

export interface IDomainEventsRepository {
  sendAppEvent(event: BaseDomainEvent<DomainEventSources, Record<string, any>>): Promise<void>;

  saveEventIfNotExists(
    type: string,
    source: string,
    detail: DomainEventDetailType,
    compositeIdKeys: string[]
  ): Promise<void>;

  invokeMethod(message: Record<string, any>, consumer: HandlerConsumer): Promise<void>;

  invokeUseCase(message: Record<string, any>, consumer: UseCaseConsumer): Promise<void>;
}
