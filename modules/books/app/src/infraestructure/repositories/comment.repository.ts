import { AwsDynamoDbAdapter } from '@modules/common/app/src/infraestructure/adapters/aws-dynamo-db.adapter';
import { ICommentRepository } from '../../application/contracts/comment.contract';
import { CommentEntity } from '../../domain/entities/comment.entity';

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
