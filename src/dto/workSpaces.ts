import { z } from 'zod';

export const newWorkSpaceSchema = z
  .object({
    name: z.string(),
    userId: z.coerce.number(),
  })
  .strict();

export const updateWorkSpaceSchema = z
  .object({
    id: z.coerce.number(),
    name: z.string(),
  })
  .strict();

export const deleteWorkSpaceSchema = z
  .object({
    id: z.coerce.number(),
  })
  .strict();
