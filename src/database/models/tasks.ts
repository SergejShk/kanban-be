import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

import boards from './boards';

const tasks = pgTable('tasks', {
  id: serial('id').primaryKey().notNull(),
  index: integer('index').notNull(),
  name: varchar('name').notNull(),
  description: varchar('description').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  boardId: integer('board_id')
    .references(() => boards.id)
    .notNull(),
});

export default tasks;

export type Task = InferSelectModel<typeof tasks>;
export type NewTask = InferInsertModel<typeof tasks>;
