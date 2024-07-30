import { AwsDynamoDbAdapter } from '@modules/shared/app/infraestructure/src/adapters/aws-dynamo-db.adapter';
import { CommentEntity } from '../../../domain/src/entities/comment.entity';
import { ICommentRepository } from '../../../application/src/contracts/comment.contract';

export class CommentRepository implements ICommentRepository {
  async save(comment: CommentEntity) {
    const Item = {
      PK: `BOOK`,
      SK: `BOOK#${comment.bookId}#COMMENT#${comment.id}`,
      id: comment.id,
      bookId: comment.bookId,
      text: comment.text,
    };

    await AwsDynamoDbAdapter.upsertItem({
      TableName: process.env.BOOK_TABLE_NAME,
      Item,
    });
  }
}
