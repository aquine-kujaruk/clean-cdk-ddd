import { LambdaInvokeTask } from '@modules/shared/app/application/lib/custom-tasks/lambda-invoke.task';
import { LambdaBuilderConstruct } from '@modules/shared/app/lib/helpers/builders/lambda.builder';
import { ChainableSfnDefinition } from '@modules/shared/app/lib/helpers/builders/state-machine.builder';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Fail, JsonPath } from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';
import { BookLambda } from '../../infraestructure/lib/book.lambda';
import { CommentService } from '../src/services/comment.service';

enum StepNames {
  CREATE_COMMENT = 'Create Comment Object',
  SAVE_COMMENT = 'Save Comment in Database',
  DISPATCH_CREATED_COMMENT_EVENT = 'Dispatch created comment event',
}

export class AddCommentDefinition extends ChainableSfnDefinition {
  private readonly fail: Fail;
  private readonly bookHandler: IFunction;

  constructor(scope: Construct) {
    super(scope);

    this.fail = new Fail(scope, 'Fail');

    this.bookHandler = LambdaBuilderConstruct.getImportedResource(this.scope, BookLambda.name);
  }

  public get definitionChain() {
    return this.createComment.next(this.saveComment).next(this.dispatchEvent);
  }

  private get createComment() {
    return new LambdaInvokeTask(this.scope, StepNames.CREATE_COMMENT, {
      lambdaFunction: this.bookHandler,
      payloadResponseOnly: true,
      payload: {
        service: CommentService,
        methodName: CommentService.createComment.name,
        input: {
          text: JsonPath.stringAt('$.body.text'),
          bookId: JsonPath.stringAt('$.path.bookId'),
        },
        initializeContext: true,
      },
    }).addCatch(this.fail);
  }

  private get saveComment() {
    return new LambdaInvokeTask(this.scope, StepNames.SAVE_COMMENT, {
      lambdaFunction: this.bookHandler,
      payloadResponseOnly: true,
      payload: {
        service: CommentService,
        methodName: CommentService.saveComment.name,
        input: JsonPath.objectAt(LambdaInvokeTask.previousStepOutput),
      },
    }).addCatch(this.fail);
  }

  private get dispatchEvent() {
    return new LambdaInvokeTask(this.scope, StepNames.DISPATCH_CREATED_COMMENT_EVENT, {
      lambdaFunction: this.bookHandler,
      payloadResponseOnly: true,
      payload: {
        service: CommentService,
        methodName: CommentService.sendCommentCreatedEvent.name,
        input: JsonPath.objectAt(LambdaInvokeTask.executionStepOutput(StepNames.CREATE_COMMENT)),
      },
      resultSelector: {
        commentId: JsonPath.stringAt(
          LambdaInvokeTask.executionStepOutput(StepNames.CREATE_COMMENT, 'id')
        ),
      },
    }).addCatch(this.fail);
  }
}
