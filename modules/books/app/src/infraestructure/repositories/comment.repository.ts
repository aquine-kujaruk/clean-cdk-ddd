import { AwsDynamoDbAdapter } from '@modules/common/app/src/infraestructure/adapters/aws-dynamo-db.adapter';
import { ICommentRepository } from '../../application/contracts/comment.contract';
import { Book } from '../../domain/entities/book.entity';
import { Comment } from '../../domain/entities/comment.entity';

const TableName = process.env.BOOK_TABLE_NAME;

export class CommentRepository implements ICommentRepository {
  async save(comment: Comment) {
    await AwsDynamoDbAdapter.transactWriteItems({
      TransactItems: [
        {
          Put: {
            TableName,
            Item: {
              PK: `COMMENT#${comment.id}`,
              SK: 'METADATA',
              ENTITIES: [Comment],
              ...comment,
            },
          },
        },
        {
          Put: {
            TableName,
            Item: {
              PK: `BOOK#${comment.bookId}`,
              SK: `COMMENT#${comment.id}`,
              ENTITIES: [Book, Comment],
              commentId: comment.id,
              summary: comment.summary,
            },
          },
        },
      ],
    });
  }
}
