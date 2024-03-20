import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { asc, eq } from 'drizzle-orm';

import tasks, { NewTask } from './models/tasks';

export class TasksDb {
  constructor(private db: NodePgDatabase) {}

  public getListByBoard = async (boardId: number) =>
    this.db
      .select()
      .from(tasks)
      .where(eq(tasks.boardId, boardId))
      .orderBy(asc(tasks.index));

  public createTask = async (newTask: NewTask) =>
    this.db
      .insert(tasks)
      .values(newTask)
      .returning()
      .then(res => res[0]);
}
