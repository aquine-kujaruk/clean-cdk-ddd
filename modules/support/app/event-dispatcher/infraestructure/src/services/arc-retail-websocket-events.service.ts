import { BaseService } from '@modules/shared/app/src/infraestructure/services/base.service';
import { EventBridgeEvent } from 'aws-lambda';
import { AppEvents } from '../../app.events';
import { AwsStepFunctionRepository } from '../repositories/aws-state-function.repository';
import { EventDbRepository } from '../repositories/event-db.repository';

export type ArcWebsocketEventMessageType = {
  'detail-type': keyof typeof AppEvents;
  detail: {
    index: string;
    message: Record<string, any>;
  };
} & EventBridgeEvent<string, any>;

export class ArcRetailWebsocketEventService extends BaseService {
  static async [AppEvents.GIFT_REDEEMED](data: ArcWebsocketEventMessageType) {
    const referenceKeys = ['gifterAccountID', 'redeemerAccountID'];
    const target = process.env.CREATE_BOOK_STATE_MACHINE_ARN as string;

    const eventDbRepository = new EventDbRepository();
    await eventDbRepository.save(data, referenceKeys);

    const awsStepFunctionRepository = new AwsStepFunctionRepository();
    await awsStepFunctionRepository.invokeAsyncExecution(target, {
      body: { name: data.detail.message.gifterAccountID },
    });
  }

  static async [AppEvents.REDEEM_SHARED_SUBSCRIPTION](data: ArcWebsocketEventMessageType) {
    const referenceKeys = ['parentAccountID', 'associateAccountID'];

    const eventDbRepository = new EventDbRepository();
    await eventDbRepository.save(data, referenceKeys);
  }
}
