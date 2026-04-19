import express, { Router, Application } from 'express';
import { login as loginHandler } from '../controllers/authController.js';

export class AuthRouter {
  public router: Router;

  constructor() {
    this.router = express.Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post('/login', loginHandler);
  }

  public register(app: Application, prefix = '/api') {
    app.use(prefix, this.router);
  }
}

export default AuthRouter;
