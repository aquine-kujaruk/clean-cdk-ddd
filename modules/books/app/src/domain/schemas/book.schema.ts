import { EntityTimestampsSchema } from '@modules/common/app/src/domain/schemas/entity-timestamp.schema';
import { z } from 'zod';

export const BookEntitySchema = z
  .object({
    id: z.string().min(1, 'id cannot be empty'),
    name: z.string().min(1, 'name cannot be empty'),
    author: z.string().min(1, 'author cannot be empty'),
    description: z.string().min(1, 'description cannot be empty'),
    commentsCount: z.number().int().nonnegative().optional(),
  })
  .merge(EntityTimestampsSchema);

export type BookProps = z.infer<typeof BookEntitySchema>;
