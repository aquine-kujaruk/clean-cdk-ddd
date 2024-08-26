import { EventBridgeEvent } from '@aws-lambda-powertools/parser/types';
import {
  BaseDomainEvent,
  DomainEventDetailType,
  HandlerConsumer,
  IDomainEvent,
  UseCaseConsumer,
} from '@modules/common/app/src/domain/events/base.domain-event';
import { BaseController } from '@modules/common/app/src/infraestructure/controllers/base.controller';
import { DomainEventSources } from '../../../domain-event.sources';
import { DomainEvents } from '../../domain/domain-events';
import { DomainEventsRepository } from '../repositories/domain-events.repository';

const domainEventsRepository = new DomainEventsRepository();

export class DispatchEventsController extends BaseController {
  static async dispatch({ body }: { body: string }) {
    const input: EventBridgeEvent & { detail: DomainEventDetailType } = JSON.parse(body);

    const DomainEvent = DomainEvents.find(
      (event: IDomainEvent<DomainEventSources>) => (event as any).type === input['detail-type']
    );

    if (!DomainEvent) throw new Error('DomainEvent definition not found');

    const domainEvent = new DomainEvent();

    await DispatchEventsController.saveEventIfNotExists(input, domainEvent);
    await DispatchEventsController.dispatchDomainEvent(input, domainEvent);
  }

  static async saveEventIfNotExists(
    input: EventBridgeEvent & { detail: DomainEventDetailType },
    domainEvent: BaseDomainEvent<DomainEventSources, Record<string, any>>
  ) {
    await domainEventsRepository.saveEventIfNotExists(
      input['detail-type'],
      input.source,
      input.detail,
      domainEvent.compositeIdKeys
    );
  }

  static async dispatchDomainEvent(
    input: EventBridgeEvent & { detail: DomainEventDetailType },
    domainEvent: BaseDomainEvent<DomainEventSources, Record<string, any>>
  ) {
    const invokeMethodPromises = domainEvent
      .methodConsumers()
      .map((consumer: HandlerConsumer) =>
        domainEventsRepository.invokeMethod(input.detail, consumer)
      );

    const invokeUseCasePromises = domainEvent
      .useCaseConsumers()
      .map((consumer: UseCaseConsumer) =>
        domainEventsRepository.invokeUseCase(input.detail, consumer)
      );

    await Promise.all([...invokeMethodPromises, ...invokeUseCasePromises]);
  }
}
