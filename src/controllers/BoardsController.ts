import { RequestHandler } from 'express';

import { Controller } from './Controller';

import { Board } from '../database/models/boards';

import { BoardsService } from '../services/boardsService';

import { BaseResponse, okResponse } from '../api/baseResponses';

import { AuthMiddlewares } from '../middlewares/authMiddlewares';

import { InvalidParameterError } from '../errors/customErrors';

import {
  deleteBoardSchema,
  getListByWorkSpaceSchema,
  newBoardSchema,
  updateBoardSchema,
} from '../dto/boards';

export class BoardsController extends Controller {
  boardsService: BoardsService;
  authMiddlewares: AuthMiddlewares;

  constructor(boardsService: BoardsService, authMiddlewares: AuthMiddlewares) {
    super('/boards');

    this.authMiddlewares = authMiddlewares;
    this.boardsService = boardsService;

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/',
      this.authMiddlewares.isAuthorized,
      this.link({ route: this.createBoard })
    );
    this.router.get(
      '/:workSpaceId',
      this.authMiddlewares.isAuthorized,
      this.link({ route: this.getBoardsList })
    );
    this.router.put(
      '/:id',
      this.authMiddlewares.isAuthorized,
      this.link({ route: this.updateBoard })
    );
    this.router.delete(
      '/:id',
      this.authMiddlewares.isAuthorized,
      this.link({ route: this.deleteBoard })
    );
  }

  private createBoard: RequestHandler<{}, BaseResponse<Board>> = async (
    req,
    res,
    next
  ) => {
    try {
      const validatedBody = newBoardSchema.safeParse(req.body);

      if (!validatedBody.success) {
        throw new InvalidParameterError('Bad request');
      }

      const result = await this.boardsService.create(validatedBody.data);

      return res.status(200).json(okResponse(result));
    } catch (e) {
      next(e);
    }
  };

  private getBoardsList: RequestHandler<
    { workSpaceId: number },
    BaseResponse<Board[]>
  > = async (req, res, next) => {
    try {
      const validatedBody = getListByWorkSpaceSchema.safeParse({
        workSpaceId: req.params.workSpaceId,
      });

      if (!validatedBody.success) {
        throw new InvalidParameterError('Bad request');
      }

      const result = await this.boardsService.getListByWorkSpace(
        validatedBody.data.workSpaceId
      );

      return res.status(200).json(okResponse(result));
    } catch (e) {
      next(e);
    }
  };

  private updateBoard: RequestHandler<{ id: string }, BaseResponse<Board>> =
    async (req, res, next) => {
      try {
        const validatedBody = updateBoardSchema.safeParse({
          ...req.body,
          id: req.params.id,
        });

        if (!validatedBody.success) {
          throw new InvalidParameterError('Bad request');
        }

        const result = await this.boardsService.update(validatedBody.data);

        return res.status(200).json(okResponse(result));
      } catch (e) {
        next(e);
      }
    };

  private deleteBoard: RequestHandler<{ id: string }, BaseResponse<boolean>> =
    async (req, res, next) => {
      try {
        const validatedBody = deleteBoardSchema.safeParse({
          id: req.params.id,
        });

        if (!validatedBody.success) {
          throw new InvalidParameterError('Bad request');
        }

        const isDeleted = await this.boardsService.delete(
          validatedBody.data.id
        );

        return res.status(200).json(okResponse(isDeleted));
      } catch (e) {
        next(e);
      }
    };
}
