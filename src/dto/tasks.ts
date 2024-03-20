import { z } from 'zod';

export const newTaskSchema = z
  .object({
    index: z.number(),
    name: z.string(),
    description: z.string(),
    boardId: z.number(),
  })
  .strict();
