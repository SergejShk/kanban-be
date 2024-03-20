import { NewTask } from '../database/models/tasks';
import { TasksDb } from '../database/tasksDb';

export class TasksService {
  private tasksDb: TasksDb;

  constructor(tasksDb: TasksDb) {
    this.tasksDb = tasksDb;
  }

  create = async (newTask: NewTask) => {
    return this.tasksDb.createTask(newTask);
  };

  updateTasks = (updTasks: NewTask) => {
    return this.tasksDb.updateTasks(updTasks);
  };

  deleteTasksByBoardId = (boardId: number) => {
    return this.tasksDb.deleteByBoardId(boardId);
  };
}
