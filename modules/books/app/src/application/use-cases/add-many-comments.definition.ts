import { ChainableSfnDefinition } from '@modules/common/app/lib/constructs/step-functions/state-machine.construct';
import { InlineMapTask } from '@modules/common/app/lib/constructs/step-functions/tasks/inline-map.task';
import { LambdaInvokeTask } from '@modules/common/app/lib/constructs/step-functions/tasks/lambda-invoke.task';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Fail, JsonPath, ProcessorType } from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';
import { BookLambda } from '../../../lib/book.lambda';
import { CommentController } from '../../infraestructure/controllers/comment.controller';

enum Steps {
  FORMAT_COMMENTS = 'Format Comments',
  ADD_COMMENTS_BATCH = 'Add Many Comments Batch',
  CREATE_COMMENT = 'Create Comment Object',
  SAVE_COMMENT = 'Save Comment in Database',
  DISPATCH_CREATED_COMMENT_EVENT = 'Dispatch created comment event',
}

export class AddManyCommentDefinition extends ChainableSfnDefinition {
  private readonly fail: Fail;
  private readonly bookHandler: IFunction;

  constructor(scope: Construct) {
    super(scope);

    this.fail = new Fail(scope, 'Fail');

    this.bookHandler = BookLambda.getImportedResource(this.scope);
  }

  public get definitionChain() {
    return this[Steps.FORMAT_COMMENTS].next(this[Steps.ADD_COMMENTS_BATCH]);
  }

  private get [Steps.FORMAT_COMMENTS]() {
    return new LambdaInvokeTask(this.scope, Steps.FORMAT_COMMENTS, {
      lambdaFunction: this.bookHandler,
      payloadResponseOnly: true,
      payload: {
        controller: CommentController,
        methodName: CommentController.formatComments.name,
      },
    }).addCatch(this.fail);
  }

  private get [Steps.ADD_COMMENTS_BATCH]() {
    const mapProcessor = this[Steps.CREATE_COMMENT]
      .next(this[Steps.SAVE_COMMENT])
      .next(this[Steps.DISPATCH_CREATED_COMMENT_EVENT]);

    return new InlineMapTask(this.scope, Steps.ADD_COMMENTS_BATCH, {
      itemsPath: '$.context.formatComments.output',
      mapProcessor,
      executionType: ProcessorType.STANDARD,
    }).formatResult();
  }

  private get [Steps.CREATE_COMMENT]() {
    return new LambdaInvokeTask(this.scope, Steps.CREATE_COMMENT, {
      lambdaFunction: this.bookHandler,
      payloadResponseOnly: true,
      payload: {
        controller: CommentController,
        methodName: CommentController.createComment.name,
        input: {
          path: { bookId: JsonPath.stringAt('$.input.bookId') },
          body: { content: JsonPath.stringAt('$.input.content') },
        },
      },
    });
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
    });
  }

  private get [Steps.DISPATCH_CREATED_COMMENT_EVENT]() {
    return new LambdaInvokeTask(this.scope, Steps.DISPATCH_CREATED_COMMENT_EVENT, {
      lambdaFunction: this.bookHandler,
      payloadResponseOnly: true,
      payload: {
        controller: CommentController,
        methodName: CommentController.sendCommentCreatedEvent.name,
        input: JsonPath.objectAt(LambdaInvokeTask.getOutputPath(Steps.CREATE_COMMENT)),
      }
    });
  }
}
