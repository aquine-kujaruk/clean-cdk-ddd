import { DynamoDbBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/dynamo-db.builder';
import { NodejsFunctionBuilderConstruct } from '@packages/shared/app/lib/helpers/builders/nodejs-function.builder';
import { User } from '@packages/shared/app/lib/stateful-resources/databases/dynamo-db/tables/user.table';
import { Duration } from 'aws-cdk-lib';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { CoreStackProps } from '../../..';

export class UserInfraestructureLambda extends NodejsFunctionBuilderConstruct {
  public readonly handler?: Function;

  constructor(scope: Construct, props: CoreStackProps) {
    super(scope, UserInfraestructureLambda.name, {
      entry: `${__dirname}/code/index.ts`,
      environment: {
        ...props.environment,
        USER_TABLE_NAME: DynamoDbBuilderConstruct.getResourceName(User.name),
      },
      timeout: Duration.seconds(30),
      bundling: {
        nodeModules: ['@aws-sdk/util-dynamodb', 'uuid', 'dayjs'],
      },
    });

    super.build();
  }
}
