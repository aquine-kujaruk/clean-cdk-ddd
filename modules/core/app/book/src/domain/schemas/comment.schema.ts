import { z } from 'zod';

export const CommentEntitySchema = z.object({
  id: z.string().min(1, "id cannot be empty"),
  text: z.string().min(1, "text cannot be empty"),
  bookId: z.string().min(1, "bookId cannot be empty"),
});