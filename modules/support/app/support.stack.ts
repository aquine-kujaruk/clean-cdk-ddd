import { Configurations } from '@modules/shared/configurations';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RestApis } from './apis/infraestructure/lib/rest-apis.stack';
import { EventDispatcher } from './event-dispatcher/infraestructure/lib/event-dispatcher.stack';

const { AWS_ACCOUNT_ID, AWS_REGION } = Configurations.getEnvs();

export class SupportStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      env: {
        region: AWS_REGION,
        account: AWS_ACCOUNT_ID,
      },
    });

    new RestApis(this);
    new EventDispatcher(this);
  }
}
