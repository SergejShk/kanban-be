import { Board } from '../database/models/boards';
import { Task } from '../database/models/tasks';

export interface INewBoard {
  name: string;
  workSpaceId: number;
}

export interface IUpdateBoard {
  id: number;
  name: string;
  workSpaceId: number;
}

export interface IBoardWithTasks {
  boards: Board;
  tasks: Task | null;
}

export interface INormalizedBoard extends Board {
  tasks: Task[];
}
