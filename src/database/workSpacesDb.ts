import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, asc, eq, ilike } from 'drizzle-orm';

import workSpaces, { NewWorkSpace } from './models/workSpaces';

import { IUpdateWorkSpace } from '../interfaces/workSpaces';

export class WorkSpacesDb {
  constructor(private db: NodePgDatabase) {}

  public getListByUser = async (userId: number, query?: string) => {
    const q = query ? query : '';

    return this.db
      .select()
      .from(workSpaces)
      .where(
        and(eq(workSpaces.userId, userId), ilike(workSpaces.name, `%${q}%`))
      )
      .orderBy(asc(workSpaces.createdAt));
  };

  public getById = async (id: number) =>
    this.db.select().from(workSpaces).where(eq(workSpaces.id, id));

  public createWorkSpace = async (newWorkSpace: NewWorkSpace) =>
    this.db
      .insert(workSpaces)
      .values(newWorkSpace)
      .returning()
      .then(res => res[0]);

  public updateWorkSpace = async (workSpace: IUpdateWorkSpace) =>
    this.db
      .update(workSpaces)
      .set({
        name: workSpace.name,
      })
      .where(eq(workSpaces.id, workSpace.id))
      .returning()
      .then(res => res[0]);

  public deleteWorkSpace = async (id: number) =>
    this.db.delete(workSpaces).where(eq(workSpaces.id, id));
}
