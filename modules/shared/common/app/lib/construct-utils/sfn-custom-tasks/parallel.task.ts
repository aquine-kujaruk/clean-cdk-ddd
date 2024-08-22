import {
  CatchProps,
  Chain,
  IChainable,
  JsonPath,
  Parallel,
  ParallelProps,
  RetryProps,
  StateGraph,
  TaskInput,
} from 'aws-cdk-lib/aws-stepfunctions';
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';
import { CommonLambda } from '../../resources/lambda-functions/common.lambda';

export class ParallelTask extends Parallel {
  constructor(
    private readonly scope: Construct,
    private readonly parallelTaskName: string,
    props: ParallelProps
  ) {
    super(scope, parallelTaskName, {
      ...props,
      resultSelector: {
        parallelTaskName,
        payload: JsonPath.entirePayload,
      },
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

  public next(next: IChainable): Chain {
    return super.next(next);
  }

  public branch(...branches: IChainable[]): this {
    super.branch(...branches);
    return this;
  }

  public bindToGraph(graph: StateGraph): void {
    return super.bindToGraph(graph);
  }

  public toStateJson(): object {
    return super.toStateJson();
  }

  public formatResult(): Chain {
    const formatResultTask = new LambdaInvoke(
      this.scope,
      `${this.parallelTaskName}: Format Result`,
      {
        lambdaFunction: CommonLambda.getImportedResource(this.scope),
        payloadResponseOnly: true,
        payload: TaskInput.fromObject({
          stateName: JsonPath.stateName,
          input: JsonPath.objectAt('$'),
        }),
        retryOnServiceExceptions: false,
      }
    );

    return this.next(formatResultTask);
  }
}
