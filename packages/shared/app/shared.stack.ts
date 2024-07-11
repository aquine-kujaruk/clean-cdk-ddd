import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StatefulResources } from './lib/stateful-resources';


export class SharedStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new StatefulResources(this);
  }
}