import { Comment } from "../../domain/entities/comment.entity";

export interface ICommentRepository {
  save(comment: Comment): Promise<void>;
}
