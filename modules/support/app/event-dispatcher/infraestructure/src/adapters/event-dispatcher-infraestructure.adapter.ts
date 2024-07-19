import { BatchProcessor, EventType } from '@aws-lambda-powertools/batch';
import { ServiceClassType } from '@modules/shared/app/src/infraestructure/services/base.service';
import { LambdaHandlerRouter } from '@modules/shared/app/src/infraestructure/lambda-handler.router';
import type { Context, SQSBatchResponse, SQSEvent } from 'aws-lambda';
import { AppEventSources } from '../../app.event-sources';
import { ArcRetailWebsocketEventService } from '../services/arc-retail-websocket-events.service';

const processor = new BatchProcessor(EventType.SQS);

type ServiceRoutesType = Partial<Record<AppEventSources, ServiceClassType>>

const serviceRoutes: ServiceRoutesType = {
  [AppEventSources.ARC_RETAIL_WEBSOCKET]: ArcRetailWebsocketEventService,
  [AppEventSources.PUBLIC_API]: ArcRetailWebsocketEventService,
};

const triggerUseCase = async ({ body }: { body: string }) => {
  const input = JSON.parse(body);
  const methodName = input['detail-type'];
  const service = serviceRoutes[input.source as AppEventSources]?.name as string;

  const router = new LambdaHandlerRouter(
    { service, methodName, input },
    Object.values(serviceRoutes)
  );

  await router.route();
};

export const handler = async (event: SQSEvent, context: Context): Promise<SQSBatchResponse> => {
  console.log('Functions params', JSON.stringify(event, null, 2));

  const batch = event.Records;

  processor.register(batch, triggerUseCase, { context });

  const processedMessages = await processor.process();

  for (const message of processedMessages) {
    const [status, error, record] = message;

    console.log('Processed record', { status, record, error });
  }

  return processor.response();
};
