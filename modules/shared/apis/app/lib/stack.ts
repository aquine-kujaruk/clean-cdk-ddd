import { CommandQueryType } from '@modules/common/app/lib/constructs/api-gateway/rest-api.types';
import { AuthorizerFunctionConstruct } from '@modules/common/app/lib/constructs/api-gateway/authorizer-function.construct';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Apis } from './apis';
import { Authorizers } from './authorizers';
import { commands } from './commands';
import { queries } from './queries';

export interface ApisProps {
  commands: CommandQueryType[];
  queries: CommandQueryType[];
  authorizers: AuthorizerFunctionConstruct[];
}

export class ApisStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const { authorizers } = new Authorizers(this);

    new Apis(this, { commands, queries, authorizers });
  }
}
