import { DynamoDbBuilderConstruct } from '@modules/shared/app/lib/helpers/builders/dynamo-db.builder';
import { NodejsFunctionBuilderConstruct } from '@modules/shared/app/lib/helpers/builders/nodejs-function.builder';
import { User } from '@modules/shared/app/lib/stateful-resources/databases/dynamo-db/tables/user.table';
import { Duration } from 'aws-cdk-lib';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path from 'path';
import { CoreStackProps } from '../../../core.stack';

export class BookInfraestructureLambda extends NodejsFunctionBuilderConstruct {
  public readonly handler?: Function;

  constructor(scope: Construct, props: CoreStackProps) {
    super(scope, BookInfraestructureLambda.name, {
      entry: path.resolve(__dirname, '../src/adapters/book-infraestructure.handler.ts'),
      environment: {
        ...props.environment,
        BOOK_TABLE_NAME: DynamoDbBuilderConstruct.getResourceName(User.name),
      },
      timeout: Duration.seconds(30),
      bundling: {
        nodeModules: ['@aws-sdk/util-dynamodb', 'uuid', 'dayjs'],
      },
    });

    super.build();
  }
}
