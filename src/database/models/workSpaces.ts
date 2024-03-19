import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

import users from './users';

const workSpaces = pgTable('workSpaces', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
});

export default workSpaces;

export type WorkSpace = InferSelectModel<typeof workSpaces>;
export type NewWorkSpace = InferInsertModel<typeof workSpaces>;
