import {
  CatchProps,
  Chain,
  CustomState,
  IChainable,
  ItemBatcherProps,
  JsonPath,
  Map,
  MapProps,
  Pass,
  ProcessorMode,
  ProcessorType,
  RetryProps,
  TaskInput,
  TaskStateBase,
} from 'aws-cdk-lib/aws-stepfunctions';
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';
import { ulid } from 'ulidx';
import { CommonLambda } from '../../../resources/lambda/functions/common.lambda';

interface S3MapTaskProps extends Omit<MapProps, 'itemSelector' | 'resultSelector'> {
  executionType?: ProcessorType;
  mapProcessor: TaskStateBase | Chain;
  itemBatcher: ItemBatcherProps;
  itemReader: {
    inputType: 'JSON' | 'CSV';
    bucket: string;
    key?: string;
  };
}

export class S3MapTask extends CustomState {
  constructor(
    private readonly scope: Construct,
    private readonly mapTaskName: string,
    props: S3MapTaskProps
  ) {
    const {
      executionType,
      mapProcessor,
      itemBatcher,
      itemReader: s3ItemReader,
      ...mapProps
    } = props;

    const inputAdapter = new Pass(scope, `${mapTaskName}: Input Adapter`, {
      parameters: {
        'context.$': '$.Items[0].stateInput.context',
        'input.$': '$.Items[0].item',
      },
    });

    const processor = inputAdapter.next(mapProcessor);

    const stateJson = new Map(scope, ulid(), {
      ...mapProps,
      itemSelector: {
        'item.$': '$$.Map.Item.Value',
        'stateInput.$': '$',
      },
      resultSelector: {
        mapTaskName: mapTaskName,
        payload: JsonPath.entirePayload,
      },
    })
      .itemProcessor(processor, {
        mode: ProcessorMode.DISTRIBUTED,
        executionType,
      })
      .toStateJson() as any;

    stateJson.ItemReader = {
      ReaderConfig: {
        InputType: s3ItemReader.inputType,
        CSVHeaderLocation: s3ItemReader.inputType === 'CSV' ? 'FIRST_ROW' : undefined,
      },
      Resource: 'arn:aws:states:::s3:getObject',
      Parameters: {
        Bucket: s3ItemReader.bucket,
        Key: s3ItemReader.key,
      },
    };

    stateJson.ItemBatcher = {
      MaxItemsPerBatch: itemBatcher.maxItemsPerBatch,
      MaxItemsPerBatchPath: itemBatcher.maxItemsPerBatchPath,
      MaxInputBytesPerBatch: itemBatcher.maxInputBytesPerBatch,
      MaxInputBytesPerBatchPath: itemBatcher.maxInputBytesPerBatchPath,
      BatchInput: itemBatcher.batchInput,
    };

    super(scope, mapTaskName, { stateJson: {...stateJson, End: undefined} });
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
        metadata: JsonPath.objectAt('$'),
      }),
      retryOnServiceExceptions: false,
    });

    return this.next(formatResultTask);
  }
}
