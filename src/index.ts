import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import dotenv from 'dotenv';

import App from './app';

import { UsersDb } from './database/usersDb';
import { WorkSpacesDb } from './database/workSpacesDb';
import { BoardsDb } from './database/boardsDb';
import { TasksDb } from './database/tasksDb';

import { AuthService } from './services/authService';
import { WorkSpacesService } from './services/workSpacesService';
import { BoardsService } from './services/boardsService';
import { TasksService } from './services/tasksService';

import { AuthMiddlewares } from './middlewares/authMiddlewares';

import { AuthController } from './controllers/AuthController';
import { WorkSpaceController } from './controllers/WorkSpacesController';
import { BoardsController } from './controllers/BoardsController';
import { TasksController } from './controllers/TasksController';

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;
const STAGE = process.env.STAGE;
const DATABASE_URL = process.env.DATABASE_URL;

const serverStart = async () => {
  try {
    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: true,
    });
    const db = drizzle(pool, {
      logger: STAGE === 'LOCAL' ? true : false,
    });

    // migrations
    await migrate(db, { migrationsFolder: './migrations' });

    // dbs
    const usersDb = new UsersDb(db);
    const workspacesDb = new WorkSpacesDb(db);
    const boardsDb = new BoardsDb(db);
    const tasksDb = new TasksDb(db);

    // services
    const authService = new AuthService(usersDb);
    const workspacesService = new WorkSpacesService(workspacesDb);
    const boardsService = new BoardsService(boardsDb);
    const tasksService = new TasksService(tasksDb);

    // middlewares
    const authMiddlewares = new AuthMiddlewares(usersDb);

    //controllers
    const authController = new AuthController(authService, authMiddlewares);
    const workSpaceController = new WorkSpaceController(
      workspacesService,
      authMiddlewares
    );
    const boardsController = new BoardsController(
      boardsService,
      authMiddlewares
    );
    const tasksController = new TasksController(tasksService, authMiddlewares);

    const app = new App(PORT, [
      authController,
      workSpaceController,
      boardsController,
      tasksController,
    ]);

    app.listen();
  } catch (error: any) {
    console.log(error.message);
    process.exit(1);
  }
};

serverStart();
