import { DynamoDbBuilderConstruct } from '@modules/shared/app/infraestructure/lib/construct-utils/builders/dynamo-db.builder';
import { EventBusBuilderConstruct } from '@modules/shared/app/infraestructure/lib/construct-utils/builders/event-bus.builder';
import { NodejsFunctionBuilderConstruct } from '@modules/shared/app/infraestructure/lib/construct-utils/builders/nodejs-function.builder';
import { MultiPurpose } from '@modules/shared/app/infraestructure/lib/stateful-resources/databases/dynamo-db/tables/multi-purpose.table';
import { AppEventsBus } from '@modules/support/app/event-dispatcher/infraestructure/lib/app-events.bus';
import { Duration } from 'aws-cdk-lib';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path from 'path';
import { CoreStackProps } from '../../../core.stack';

export class BookLambda extends NodejsFunctionBuilderConstruct {
  public readonly handler?: Function;

  constructor(scope: Construct, props: CoreStackProps) {
    super(scope, BookLambda.name, {
      entry: path.resolve(__dirname, '../src/adapters/book.handler.ts'),
      environment: {
        ...props.environment,
        BOOK_TABLE_NAME: DynamoDbBuilderConstruct.getResourceName(MultiPurpose.name),
        APP_EVENT_BUS_NAME: EventBusBuilderConstruct.getResourceName(AppEventsBus.name),
      },
      timeout: Duration.seconds(30),
      bundling: {
        nodeModules: ['@aws-sdk/util-dynamodb', 'uuid', 'dayjs'],
      },
    });

    super.build();
  }
}
