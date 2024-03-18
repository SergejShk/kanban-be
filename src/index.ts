import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import dotenv from 'dotenv';

import App from './app';

import { UsersDb } from './database/usersDb';

import { AuthService } from './services/authService';

import { AuthMiddlewares } from './middlewares/authMiddlewares';

import { AuthController } from './controllers/AuthController';

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

    // services
    const authService = new AuthService(usersDb);

    // middlewares
    const authMiddlewares = new AuthMiddlewares(usersDb);

    //controllers
    const authController = new AuthController(authService, authMiddlewares);

    const app = new App(PORT, [authController]);

    app.listen();
  } catch (error: any) {
    console.log(error.message);
    process.exit(1);
  }
};

serverStart();
