import { pgTable, serial, integer, jsonb } from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

import boards from './boards';

import { ITask } from '../../interfaces/tasks';

const tasks = pgTable('tasks', {
  id: serial('id').primaryKey().notNull(),
  tasks: jsonb('tasks').$type<ITask[]>().notNull(),
  boardId: integer('board_id')
    .references(() => boards.id)
    .notNull(),
});

export default tasks;

export type Task = InferSelectModel<typeof tasks>;
export type NewTask = InferInsertModel<typeof tasks>;
