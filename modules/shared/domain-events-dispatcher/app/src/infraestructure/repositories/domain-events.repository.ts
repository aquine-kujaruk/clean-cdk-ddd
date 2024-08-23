import { PutEventsRequestEntry } from '@aws-sdk/client-eventbridge';
import { EntityClassType } from '@modules/common/app/src/domain/entities/base.entity';
import {
  BaseDomainEvent,
  DomainEventDetailType,
  HandlerConsumer,
  UseCaseConsumer,
} from '@modules/common/app/src/domain/events/base.domain-event';
import { AwsDynamoDbAdapter } from '@modules/common/app/src/infraestructure/adapters/aws-dynamo-db.adapter';
import { AwsLambdaAdapter } from '@modules/common/app/src/infraestructure/adapters/aws-lambda.adapter';
import { AwsStepFunctionAdapter } from '@modules/common/app/src/infraestructure/adapters/aws-state-function.adapter';
import { DateRepository } from '@modules/common/app/src/infraestructure/repositories/date.repository';
import { constantCase } from 'change-case-all';
import { DomainEventSources } from '../../../domain-event.sources';
import { IDomainEventsRepository } from '../../application/contracts/domain-events.contract';
import { AwsEventBridgeAdapter } from '../adapters/aws-event-bridge.adapter';

const dateRepository = new DateRepository();

export class DomainEventsRepository implements IDomainEventsRepository {
  private async sendEvent(
    EventBusName: string,
    eventInstance: BaseDomainEvent<DomainEventSources, Record<string, any>>
  ) {
    const index = dateRepository.getUnixMilliseconds();

    const event = eventInstance.create(index.toString());

    const entry: PutEventsRequestEntry = {
      EventBusName,
      DetailType: event.eventType,
      Source: event.eventSource,
      Detail: JSON.stringify(event.detail),
    };

    await AwsEventBridgeAdapter.putEvent(entry);
  }

  public async sendAppEvent(
    eventInstance: BaseDomainEvent<DomainEventSources, Record<string, any>>
  ) {
    const { APP_EVENT_BUS_NAME } = process.env;

    if (!APP_EVENT_BUS_NAME?.length) throw new Error('process.env.APP_EVENT_BUS_NAME is required');

    const EventBusName = APP_EVENT_BUS_NAME as string;

    await this.sendEvent(EventBusName, eventInstance);
  }

  async saveEventIfNotExists(
    type: string,
    source: string,
    detail: DomainEventDetailType,
    compositeIdKeys: string[]
  ) {
    const { index, message } = detail;

    const eventDate = dateRepository.getSortableDateFormat(parseInt(index, 10));

    const compositeIdValue = compositeIdKeys.map((key) => `${constantCase(key)}#${message[key]}`);
    const ttl = dateRepository.getUnixSeconds(dateRepository.addMonths(6));

    const input = {
      TableName: process.env.EVENT_STORE_TABLE_NAME,
      Item: {
        PK: `EVENT_TYPE#${type}#SOURCE#${source}`,
        SK: `${compositeIdValue}#INDEX#${index}`,
        ENTITIES: [{ name: 'DomainEvents' } as EntityClassType],
        index,
        type,
        source,
        GSI1PK: `SORTED_EVENTS_BY_SOURCE#${source}`,
        GSI1SK: `EVENT_DATE#${eventDate}`,
        GSI2PK: `SORTED_EVENTS_BY_TYPE#${constantCase(type)}`,
        GSI2SK: `EVENT_DATE#${eventDate}`,
        ttl,
        payload: JSON.stringify(message),
      },
      ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)',
    };

    try {
      await AwsDynamoDbAdapter.upsertItem(input);
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException')
        console.warn(
          'Ignoring duplicated event. [Event]: ',
          JSON.stringify({ type, source, detail }, null, 2)
        );
      else throw error;
    }
  }

  async invokeMethod(detail: DomainEventDetailType, consumer: HandlerConsumer): Promise<void> {
    if (!consumer.handler?.length)
      throw new Error('"handler" is required, please set the proper environment variable');

    const controller = consumer.controller.name;

    await AwsLambdaAdapter.invokeLambdaAsync(consumer.handler, {
      input: detail.message,
      controller,
      methodName: consumer.methodName,
    });
  }

  async invokeUseCase(input: DomainEventDetailType, consumer: UseCaseConsumer): Promise<void> {
    if (!consumer.useCase?.length)
      throw new Error('"useCase" is required, please set the proper environment variable');

    await AwsStepFunctionAdapter.startExecutionAsync(consumer.useCase, input.message);
  }
}
