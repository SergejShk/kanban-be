import { z } from 'zod';

export const newBoardSchema = z
  .object({
    name: z.string(),
    workSpaceId: z.coerce.number(),
  })
  .strict();

export const updateBoardSchema = z
  .object({
    id: z.coerce.number(),
    name: z.string(),
    workSpaceId: z.coerce.number(),
  })
  .strict();

export const getListByWorkSpaceSchema = z
  .object({
    workSpaceId: z.coerce.number(),
  })
  .strict();

export const deleteBoardSchema = z
  .object({
    id: z.coerce.number(),
  })
  .strict();
