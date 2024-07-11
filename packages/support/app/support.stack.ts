import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EventDispatcher } from './event-dispatcher';
import { ExternalRequests } from './external-requests';

export class SupportStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new ExternalRequests(this);
    new EventDispatcher(this);
  }
}
