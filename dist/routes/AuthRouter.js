import express from 'express';
import { login as loginHandler } from '../controllers/authController.js';
export class AuthRouter {
    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/login', loginHandler);
    }
    register(app, prefix = '/api') {
        app.use(prefix, this.router);
    }
}
export default AuthRouter;
