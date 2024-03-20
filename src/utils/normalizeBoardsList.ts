import { IBoardWithTasks, INormalizedBoard } from '../interfaces/boards';

export const normalizeBoardsList = (data: IBoardWithTasks[]) => {
  const res = data.reduce<INormalizedBoard[]>((acc, row, idx) => {
    const board = row.boards;
    const tasks = row.tasks;

    if (!acc[board.id]) {
      acc[board.id] = { ...board, tasks: [] };
    }

    if (tasks) {
      acc[board.id].tasks.push(...tasks.tasks);
    }
    return acc;
  }, []);

  return Object.values(res);
};
