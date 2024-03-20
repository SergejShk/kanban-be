export interface ITask {
  id: string;
  name: string;
  description: string;
}

export interface INewTask {
  index: number;
  name: string;
  description: string;
  boardId: number;
}

export interface IUpdateTask {
  boardId: number;
  tasks: ITask[];
}
