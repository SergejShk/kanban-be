import { RequestHandler } from 'express';

import { Controller } from './Controller';

import { WorkSpacesService } from '../services/workSpacesService';

import { BaseResponse, okResponse } from '../api/baseResponses';

import { AuthMiddlewares } from '../middlewares/authMiddlewares';

import { InvalidParameterError } from '../errors/customErrors';

import {
  deleteWorkSpaceSchema,
  newWorkSpaceSchema,
  updateWorkSpaceSchema,
} from '../dto/workSpaces';

import { WorkSpace } from '../database/models/workSpaces';

import { IUser } from '../interfaces/auth';

export class WorkSpaceController extends Controller {
  workSpacesService: WorkSpacesService;
  authMiddlewares: AuthMiddlewares;

  constructor(
    workSpacesService: WorkSpacesService,
    authMiddlewares: AuthMiddlewares
  ) {
    super('/work-spaces');

    this.authMiddlewares = authMiddlewares;
    this.workSpacesService = workSpacesService;

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/',
      this.authMiddlewares.isAuthorized,
      this.link({ route: this.createWorkSpace })
    );
    this.router.get(
      '/',
      this.authMiddlewares.isAuthorized,
      this.link({ route: this.getWorkSpacesList })
    );
    this.router.put(
      '/:id',
      this.authMiddlewares.isAuthorized,
      this.link({ route: this.updateWorkSpace })
    );
    this.router.delete(
      '/:id',
      this.authMiddlewares.isAuthorized,
      this.link({ route: this.deleteWorkSpace })
    );
  }

  private createWorkSpace: RequestHandler<{}, BaseResponse<WorkSpace>> = async (
    req,
    res,
    next
  ) => {
    try {
      //  @ts-ignore
      const user = req.user as IUser;
      const validatedBody = newWorkSpaceSchema.safeParse({
        ...req.body,
        userId: user.id,
      });

      if (!validatedBody.success) {
        throw new InvalidParameterError('Bad request');
      }

      const result = await this.workSpacesService.create(validatedBody.data);

      return res.status(200).json(okResponse(result));
    } catch (e) {
      next(e);
    }
  };

  private getWorkSpacesList: RequestHandler<{}, BaseResponse<WorkSpace[]>> =
    async (req, res, next) => {
      try {
        const query = (req.query.q as string) || '';

        //  @ts-ignore
        const user = req.user as IUser;
        const result = await this.workSpacesService.getListByUserId(
          user.id,
          query
        );

        return res.status(200).json(okResponse(result));
      } catch (e) {
        next(e);
      }
    };

  private updateWorkSpace: RequestHandler<
    { id: string },
    BaseResponse<WorkSpace>
  > = async (req, res, next) => {
    try {
      const validatedBody = updateWorkSpaceSchema.safeParse({
        ...req.body,
        id: req.params.id,
      });

      if (!validatedBody.success) {
        throw new InvalidParameterError('Bad request');
      }

      //  @ts-ignore
      const user = req.user as IUser;

      const result = await this.workSpacesService.update(
        validatedBody.data,
        user.id
      );

      return res.status(200).json(okResponse(result));
    } catch (e) {
      next(e);
    }
  };

  private deleteWorkSpace: RequestHandler<
    { id: string },
    BaseResponse<boolean>
  > = async (req, res, next) => {
    try {
      const validatedBody = deleteWorkSpaceSchema.safeParse({
        id: req.params.id,
      });

      if (!validatedBody.success) {
        throw new InvalidParameterError('Bad request');
      }

      const isDeleted = await this.workSpacesService.delete(
        validatedBody.data.id
      );

      return res.status(200).json(okResponse(isDeleted));
    } catch (e) {
      next(e);
    }
  };
}
