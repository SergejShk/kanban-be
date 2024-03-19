import { WorkSpacesDb } from '../database/workSpacesDb';

import { DuplicateError, InvalidParameterError } from '../errors/customErrors';

import { INewWorkSpace, IUpdateWorkSpace } from '../interfaces/workSpaces';

export class WorkSpacesService {
  private workSpacesDb: WorkSpacesDb;

  constructor(workSpacesDb: WorkSpacesDb) {
    this.workSpacesDb = workSpacesDb;
  }

  getListByUserId = (userId: number) => {
    return this.workSpacesDb.getListByUser(userId);
  };

  create = async (newWorkSpace: INewWorkSpace) => {
    const workSpaces = await this.workSpacesDb.getListByUser(
      newWorkSpace.userId
    );
    const existedWorkSpace = workSpaces.find(
      workSpace => workSpace.name === newWorkSpace.name
    );

    if (existedWorkSpace) {
      throw new DuplicateError('Workspace with the same name exists');
    }

    return this.workSpacesDb.createWorkSpace(newWorkSpace);
  };

  update = async (workSpace: IUpdateWorkSpace, userId: number) => {
    const workSpacesList = await this.workSpacesDb.getListByUser(userId);
    const existedWorkSpace = workSpacesList.find(
      space => space.name === workSpace.name
    );

    if (existedWorkSpace) {
      throw new DuplicateError('Workspace with the same name exists');
    }

    return this.workSpacesDb.updateWorkSpace(workSpace);
  };

  delete = async (id: number) => {
    const workSpace = await this.workSpacesDb.getById(id);
    if (!workSpace) {
      throw new InvalidParameterError(`Workspace with id ${id} not found`);
    }

    await this.workSpacesDb.deleteWorkSpace(id);

    return true;
  };
}
