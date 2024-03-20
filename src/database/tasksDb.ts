import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

import tasks, { NewTask } from './models/tasks';

import { IUpdateTask } from '../interfaces/tasks';

export class TasksDb {
  constructor(private db: NodePgDatabase) {}

  public getTaskByBoardId = async (boardId: number) =>
    this.db.select().from(tasks).where(eq(tasks.boardId, boardId));

  public createTask = async (newTask: NewTask) =>
    this.db
      .insert(tasks)
      .values(newTask)
      .returning()
      .then(res => res[0]);

  public updateTasks = async (updTasks: IUpdateTask) =>
    this.db
      .update(tasks)
      .set({
        tasks: updTasks.tasks,
      })
      .where(eq(tasks.boardId, updTasks.boardId))
      .returning()
      .then(res => res[0]);

  public deleteByBoardId = async (boardId: number) =>
    this.db.delete(tasks).where(eq(tasks.boardId, boardId));
}
