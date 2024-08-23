import { ChainableSfnDefinition } from '@modules/common/app/lib/constructs/step-functions/state-machine.construct';
import { LambdaInvokeTask } from '@modules/common/app/lib/constructs/step-functions/tasks/lambda-invoke.task';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Fail, JsonPath } from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';
import { CommentController } from '../../infraestructure/controllers/comment.controller';
import { BookLambda } from '../../../lib/book.lambda';

enum Steps {
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

    this.bookHandler = BookLambda.getImportedResource(this.scope);
  }

  public get definitionChain() {
    return this[Steps.CREATE_COMMENT]
      .next(this[Steps.SAVE_COMMENT])
      .next(this[Steps.DISPATCH_CREATED_COMMENT_EVENT]);
  }

  private get [Steps.CREATE_COMMENT]() {
    return new LambdaInvokeTask(this.scope, Steps.CREATE_COMMENT, {
      lambdaFunction: this.bookHandler,
      payloadResponseOnly: true,
      payload: {
        controller: CommentController,
        methodName: CommentController.createComment.name,
        input: {
          bookId: JsonPath.stringAt('$.path.bookId'),
          content: JsonPath.stringAt('$.body.content'),
        },
        initializeContext: true,
      },
    }).addCatch(this.fail);
  }

  private get [Steps.SAVE_COMMENT]() {
    return new LambdaInvokeTask(this.scope, Steps.SAVE_COMMENT, {
      lambdaFunction: this.bookHandler,
      payloadResponseOnly: true,
      payload: {
        controller: CommentController,
        methodName: CommentController.saveComment.name,
        input: JsonPath.objectAt(LambdaInvokeTask.getOutputPath(Steps.CREATE_COMMENT)),
      },
    }).addCatch(this.fail);
  }

  private get [Steps.DISPATCH_CREATED_COMMENT_EVENT]() {
    return new LambdaInvokeTask(this.scope, Steps.DISPATCH_CREATED_COMMENT_EVENT, {
      lambdaFunction: this.bookHandler,
      payloadResponseOnly: true,
      payload: {
        controller: CommentController,
        methodName: CommentController.sendCommentCreatedEvent.name,
        input: JsonPath.objectAt(LambdaInvokeTask.getOutputPath(Steps.CREATE_COMMENT)),
      },
      resultSelector: {
        commentId: JsonPath.stringAt(LambdaInvokeTask.getOutputPath(Steps.CREATE_COMMENT, 'id')),
      },
    }).addCatch(this.fail);
  }
}
