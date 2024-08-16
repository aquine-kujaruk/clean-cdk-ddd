import { z } from 'zod';

export const EntityTimestampsSchema = z.object({
  createdAtUTC: z.optional(z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)),
  updatedAtUTC: z.optional(z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)),
});
