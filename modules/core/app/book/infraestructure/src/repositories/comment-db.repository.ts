import { AwsDynamoDbAdapter } from '@modules/shared/app/src/infraestructure/adapters/aws-dynamo-db.adapter';
import { Comment } from '../../../domain/src/entities/comment.entity';
import { CommentRepository } from '../../../domain/src/contracts/comment.repository';

export class CommentDbRepository implements CommentRepository {
  async save(comment: Comment) {
    const Item = {
      PK: `BOOK`,
      SK: `BOOK#${comment.bookId}#COMMENT#${comment.id}`,
      text: comment.text,
    };

    await AwsDynamoDbAdapter.upsertItem({
      TableName: process.env.BOOK_TABLE_NAME,
      Item,
    });
  }
}
