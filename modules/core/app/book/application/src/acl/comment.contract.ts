import { CommentEntity } from "../../../domain/src/entities/comment.entity";

export interface ICommentRepository {
  save(comment: CommentEntity): Promise<void>;
}
