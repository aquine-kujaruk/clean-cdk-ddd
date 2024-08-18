import { LambdaAuthorizerBuilderConstruct } from '@modules/common/app/lib/construct-utils/builders/lambda-authorizer.builder';
import { CommandQueryType } from '@modules/common/app/lib/construct-utils/types/rest-api.types';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Apis } from './apis';
import { Authorizers } from './authorizers';
import { commands } from './commands';
import { LambdaFunctions } from './lambda-functions';
import { queries } from './queries';

export interface ApisProps {
  commands: CommandQueryType[];
  queries: CommandQueryType[];
  authorizers: LambdaAuthorizerBuilderConstruct[];
}

export class ApisStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new LambdaFunctions(this);

    const { authorizers } = new Authorizers(this);

    new Apis(this, { commands, queries, authorizers });
  }
}
