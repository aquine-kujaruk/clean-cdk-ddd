import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EventDispatcher } from './event-dispatcher/infraestructure/lib/event-dispatcher.stack';
import { restApis } from './apis/infraestructure/lib/rest-apis.stack';

export class SupportStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new restApis(this);
    new EventDispatcher(this);
  }
}
