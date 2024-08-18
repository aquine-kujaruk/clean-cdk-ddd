import { BatchProcessor, EventType } from '@aws-lambda-powertools/batch';
import { EventBridgeEvent } from '@aws-lambda-powertools/parser/types';
import {
  BaseDomainEvent,
  DomainEventDetailType,
  HandlerConsumer,
  IDomainEvent,
  UseCaseConsumer,
} from '@modules/common/app/src/domain/events/base.domain-event';
import type { Context, SQSBatchResponse, SQSEvent } from 'aws-lambda';
import { DomainEventSources } from '../../../domain-event.sources';
import { DomainEvents } from '../../domain/domain-events';
import { DomainEventsRepository } from '../repositories/domain-events.repository';

const processor = new BatchProcessor(EventType.SQS);

const domainEventsRepository = new DomainEventsRepository();

const saveEventIfNotExists = async (
  input: EventBridgeEvent & { detail: DomainEventDetailType },
  domainEvent: BaseDomainEvent<DomainEventSources, Record<string, any>>
) => {
  await domainEventsRepository.saveEventIfNotExists(
    input['detail-type'],
    input.source,
    input.detail,
    domainEvent.compositeIdKeys
  );
};

const dispatchDomainEvent = async (
  input: EventBridgeEvent & { detail: DomainEventDetailType },
  domainEvent: BaseDomainEvent<DomainEventSources, Record<string, any>>
) => {
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
};

const handle = async ({ body }: { body: string }) => {
  const input: EventBridgeEvent & { detail: DomainEventDetailType } = JSON.parse(body);

  const DomainEvent = DomainEvents.find(
    (event: IDomainEvent<DomainEventSources>) => (event as any).type === input['detail-type']
  );

  if (!DomainEvent) throw new Error('DomainEvent definition not found');

  const domainEvent = new DomainEvent();

  await saveEventIfNotExists(input, domainEvent);
  await dispatchDomainEvent(input, domainEvent);
};

export const handler = async (event: SQSEvent, context: Context): Promise<SQSBatchResponse> => {
  console.log('Functions params', JSON.stringify(event, null, 2));

  const batch = event.Records;

  processor.register(batch, handle, { context });

  const processedMessages = await processor.process();

  for (const message of processedMessages) {
    const [status, error, record] = message;

    console.log('Processed record', { status, record, error });
  }

  return processor.response();
};
