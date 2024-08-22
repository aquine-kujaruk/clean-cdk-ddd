import {
  CatchProps,
  Chain,
  IChainable,
  JsonPath,
  Map,
  MapProps,
  ProcessorMode,
  ProcessorType,
  RetryProps,
  TaskInput,
  TaskStateBase,
} from 'aws-cdk-lib/aws-stepfunctions';
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';
import { CommonLambda } from '../../resources/lambda-functions/common.lambda';

interface InlineMapTaskProps
  extends Omit<MapProps, 'itemsPath' | 'itemSelector' | 'resultSelector'> {
  itemsPath: string;
  executionType?: ProcessorType;
  mapProcessor: TaskStateBase | Chain;
}

export class InlineMapTask extends Map {
  constructor(
    private readonly scope: Construct,
    private readonly mapTaskName: string,
    props: InlineMapTaskProps
  ) {
    const { executionType, mapProcessor, ...mapProps } = props;

    super(scope, mapTaskName, {
      ...mapProps,
      itemSelector: {
        'context.$': '$.context',
        'input.$': '$$.Map.Item.Value',
      },
      resultSelector: {
        mapTaskName,
        payload: JsonPath.entirePayload,
      },
    });

    this.itemProcessor(mapProcessor, {
      mode: ProcessorMode.INLINE,
      executionType,
    });
  }

  public addRetry(props?: RetryProps): this {
    super.addRetry(props);
    return this;
  }

  public addCatch(handler: IChainable, props?: CatchProps): this {
    super.addCatch(handler, props);
    return this;
  }

  public formatResult(): Chain {
    const formatResultTask = new LambdaInvoke(this.scope, `${this.mapTaskName}: Format Result`, {
      lambdaFunction: CommonLambda.getImportedResource(this.scope),
      payloadResponseOnly: true,
      payload: TaskInput.fromObject({
        stateName: JsonPath.stateName,
        input: JsonPath.objectAt('$'),
      }),
      retryOnServiceExceptions: false,
    });

    return this.next(formatResultTask);
  }
}
