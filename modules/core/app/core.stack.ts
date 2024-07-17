import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BookStack } from './book/infraestructure/lib/book.stack';

export interface CoreStackProps {
  environment?: Record<string, string>;
}


export class CoreStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new BookStack(this);
  }
}
