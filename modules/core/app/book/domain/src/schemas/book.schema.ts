import { z } from 'zod';

export const BookEntitySchema = z.object({
  id: z.string().min(1, "in cannot be empty"),
  name: z.string().min(1, "name cannot be empty"),
  commentsCount: z.number().int().nonnegative().optional(),
});