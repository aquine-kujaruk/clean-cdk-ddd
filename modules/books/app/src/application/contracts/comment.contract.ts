import { CommentEntity } from "../../domain/entities/comment.entity";

export interface ICommentRepository {
  save(comment: CommentEntity): Promise<void>;
}
