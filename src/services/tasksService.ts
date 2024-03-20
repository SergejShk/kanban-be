import { TasksDb } from '../database/tasksDb';

import { DuplicateError } from '../errors/customErrors';

import { INewTask } from '../interfaces/tasks';

export class TasksService {
  private tasksDb: TasksDb;

  constructor(tasksDb: TasksDb) {
    this.tasksDb = tasksDb;
  }

  getListByBoard = (boardId: number) => {
    return this.tasksDb.getListByBoard(boardId);
  };

  create = async (newTask: INewTask) => {
    const tasks = await this.getListByBoard(newTask.boardId);
    const existedBoard = tasks.find(task => task.name === newTask.name);

    if (existedBoard) {
      throw new DuplicateError('Task with the same title exists');
    }

    return this.tasksDb.createTask(newTask);
  };
}
