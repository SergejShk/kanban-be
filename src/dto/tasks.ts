import { z } from 'zod';

export const tasksSchema = z
  .object({
    id: z.number().optional(),
    boardId: z.number(),
    tasks: z
      .object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
      })
      .strict()
      .array(),
  })
  .strict();
