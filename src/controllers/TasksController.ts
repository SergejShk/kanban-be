import { RequestHandler } from 'express';

import { Controller } from './Controller';

import { Task } from '../database/models/tasks';

import { TasksService } from '../services/tasksService';

import { BaseResponse, okResponse } from '../api/baseResponses';

import { AuthMiddlewares } from '../middlewares/authMiddlewares';

import { newTaskSchema } from '../dto/tasks';

import { InvalidParameterError } from '../errors/customErrors';

export class TasksController extends Controller {
  tasksService: TasksService;
  authMiddlewares: AuthMiddlewares;

  constructor(tasksService: TasksService, authMiddlewares: AuthMiddlewares) {
    super('/tasks');

    this.authMiddlewares = authMiddlewares;
    this.tasksService = tasksService;

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/',
      this.authMiddlewares.isAuthorized,
      this.link({ route: this.createTask })
    );
  }

  private createTask: RequestHandler<{}, BaseResponse<Task>> = async (
    req,
    res,
    next
  ) => {
    try {
      const validatedBody = newTaskSchema.safeParse(req.body);
      if (!validatedBody.success) {
        throw new InvalidParameterError('Bad request');
      }

      const result = await this.tasksService.create(validatedBody.data);

      return res.status(200).json(okResponse(result));
    } catch (e) {
      next(e);
    }
  };
}
