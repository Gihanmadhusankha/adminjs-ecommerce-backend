import express from 'express';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSSequelize from '@adminjs/sequelize';
import sequelize from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
AdminJS.registerAdapter(AdminJSSequelize);
const startServer = async () => {
    try {
        const app = express();
        const PORT = process.env.PORT || 3000;
        await sequelize.authenticate();
        console.log(' Database connected!');
        await sequelize.sync({ alter: true });
        console.log(' Models synced!');
        const adminOptions = {
            resources: [User, Category],
            rootPath: '/admin',
        };
        const admin = new AdminJS(adminOptions);
        const adminRouter = AdminJSExpress.buildRouter(admin);
        app.use(admin.options.rootPath, adminRouter);
        app.listen(PORT, () => {
            console.log(` Server is running on http://localhost:${PORT}`);
            console.log(` AdminJS is available at http://localhost:${PORT}${admin.options.rootPath}`);
        });
    }
    catch (error) {
        console.error(' Connection failed:', error);
    }
};
startServer();
