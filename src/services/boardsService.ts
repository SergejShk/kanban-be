import { BoardsDb } from '../database/boardsDb';

import { DuplicateError, InvalidParameterError } from '../errors/customErrors';

import { normalizeBoardsList } from '../utils/normalizeBoardsList';

import { INewBoard, IUpdateBoard } from '../interfaces/boards';

export class BoardsService {
  private boardsDb: BoardsDb;

  constructor(boardsDb: BoardsDb) {
    this.boardsDb = boardsDb;
  }

  getListByWorkSpace = async (workSpaceId: number) => {
    const res = await this.boardsDb.getListWithTasksByWorkSpace(workSpaceId);
    const normalizedBoards = normalizeBoardsList(res);

    return normalizedBoards;
    // return this.boardsDb.getListByWorkSpace(workSpaceId);
  };

  create = async (newBoard: INewBoard) => {
    const boards = await this.boardsDb.getListByWorkSpace(newBoard.workSpaceId);
    const existedBoard = boards.find(board => board.name === newBoard.name);

    if (existedBoard) {
      throw new DuplicateError('Board with the same name exists');
    }

    return this.boardsDb.createBoard(newBoard);
  };

  update = async (board: IUpdateBoard) => {
    const boards = await this.boardsDb.getListByWorkSpace(board.workSpaceId);
    const existedBoard = boards.find(it => it.name === board.name);

    if (existedBoard) {
      throw new DuplicateError('Board with the same name exists');
    }

    return this.boardsDb.updateBoard(board);
  };

  delete = async (id: number) => {
    const board = await this.boardsDb.getById(id);
    if (!board) {
      throw new InvalidParameterError(`Board with id ${id} not found`);
    }

    await this.boardsDb.deleteBoard(id);

    return true;
  };
}
