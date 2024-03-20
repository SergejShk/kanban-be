import { NewTask } from '../database/models/tasks';
import { TasksDb } from '../database/tasksDb';

export class TasksService {
  private tasksDb: TasksDb;

  constructor(tasksDb: TasksDb) {
    this.tasksDb = tasksDb;
  }

  create = async (newTask: NewTask) => {
    const existedTask = await this.tasksDb.getTaskByBoardId(newTask.boardId);
    if (existedTask.length) {
      return this.tasksDb.updateTasks(newTask);
    }

    return this.tasksDb.createTask(newTask);
  };

  updateTasks = (updTasks: NewTask) => {
    return this.tasksDb.updateTasks(updTasks);
  };
}
