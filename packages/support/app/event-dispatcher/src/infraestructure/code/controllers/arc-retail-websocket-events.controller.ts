import { BaseController } from '@packages/shared/app/src/infraestructure/controllers/base.controller';
import { EventBridgeEvent } from 'aws-lambda';
import { AppEvents } from '../../../../app.events';
import { AwsStepFunctionRepository } from '../repositories/aws-state-function.repository';
import { EventDbRepository } from '../repositories/event-db.repository';

export type ArcWebsocketEventMessageType = {
  'detail-type': keyof typeof AppEvents;
  detail: {
    index: string;
    message: Record<string, any>;
  };
} & EventBridgeEvent<string, any>;

export class ArcRetailWebsocketEventController extends BaseController {
  static async [AppEvents.GIFT_REDEEMED](data: ArcWebsocketEventMessageType) {
    const referenceKeys = ['gifterAccountID', 'redeemerAccountID'];

    const eventDbRepository = new EventDbRepository();
    await eventDbRepository.save(data, referenceKeys);
  }

  static async [AppEvents.REDEEM_SHARED_SUBSCRIPTION](data: ArcWebsocketEventMessageType) {
    const referenceKeys = ['parentAccountID', 'associateAccountID'];
    const target = process.env.CREATE_USER_STATE_MACHINE_ARN as string

    const eventDbRepository = new EventDbRepository();
    await eventDbRepository.save(data, referenceKeys);

    const awsStepFunctionRepository = new AwsStepFunctionRepository();
    await awsStepFunctionRepository.invokeAsyncExecution(target, data);
  }
}
