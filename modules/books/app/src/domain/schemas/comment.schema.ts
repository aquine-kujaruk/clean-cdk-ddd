import { EntityTimestampsSchema } from '@modules/common/app/src/domain/schemas/entity-timestamp.schema';
import { z } from 'zod';

export const CommentEntitySchema = z
  .object({
    id: z.string().min(1, 'id cannot be empty'),
    bookId: z.string().min(1, 'bookId cannot be empty'),
    content: z.string().min(1, 'content cannot be empty'),
    summary: z
      .string()
      .min(1, 'summary cannot be empty')
      .max(10, 'summary cannot be longer than 10 characters'),
  })
  .merge(EntityTimestampsSchema);

export type CommentProps = z.infer<typeof CommentEntitySchema>;
