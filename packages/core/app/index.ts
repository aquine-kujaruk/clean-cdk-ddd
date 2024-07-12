import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { User } from './user';

export interface CoreStackProps {
  environment?: Record<string, string>;
}


export class CoreStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new User(this);
  }
}
