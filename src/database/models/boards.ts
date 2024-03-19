import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

import workSpaces from './workSpaces';

const boards = pgTable('boards', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  workSpaceId: integer('workspace_id')
    .references(() => workSpaces.id)
    .notNull(),
});

export default boards;

export type Board = InferSelectModel<typeof boards>;
export type NewBoard = InferInsertModel<typeof boards>;
