import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { asc, eq } from 'drizzle-orm';

import boards, { NewBoard } from './models/boards';

import { IUpdateBoard } from '../interfaces/boards';

export class BoardsDb {
  constructor(private db: NodePgDatabase) {}

  public getListByWorkSpace = async (workSpaceId: number) =>
    this.db
      .select()
      .from(boards)
      .where(eq(boards.workSpaceId, workSpaceId))
      .orderBy(asc(boards.createdAt));

  public getById = async (id: number) =>
    this.db.select().from(boards).where(eq(boards.id, id));

  public createBoard = async (newBoard: NewBoard) =>
    this.db
      .insert(boards)
      .values(newBoard)
      .returning()
      .then(res => res[0]);

  public updateBoard = async (board: IUpdateBoard) =>
    this.db
      .update(boards)
      .set({
        name: board.name,
      })
      .where(eq(boards.id, board.id))
      .returning()
      .then(res => res[0]);

  public deleteBoard = async (id: number) =>
    this.db.delete(boards).where(eq(boards.id, id));
}
