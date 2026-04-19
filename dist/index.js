import express from 'express';
import AdminJS, { ComponentLoader } from 'adminjs';
import * as AdminJSExpress from '@adminjs/express';
import * as AdminJSSequelize from '@adminjs/sequelize';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import * as url from 'url';
import path from 'path';
import bcrypt from 'bcrypt';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
// Custom Middlewares & Routers
import AuthRouter from './routes/AuthRouter.js';
import * as authService from './services/authService.js';
// Database & Models
import sequelize from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import OrderItem from './models/OrderItem.js';
import Setting from './models/Setting.js';
dotenv.config();
const componentLoader = new ComponentLoader();
const Components = {
    Dashboard: componentLoader.add('Dashboard', path.resolve(__dirname, './admin/components/Dashboard.tsx')),
};
AdminJS.registerAdapter(AdminJSSequelize);
const startServer = async () => {
    try {
        const app = express();
        const PORT = process.env.PORT || 3000;
        // 1. Database Connection
        await sequelize.authenticate();
        console.log('Database connected!');
        await sequelize.sync({ alter: true });
        console.log(' Models synced!');
        // 3. AdminJS Configuration
        const adminOptions = {
            resources: [
                {
                    resource: User,
                    options: {
                        parent: { name: 'User Management', icon: 'User' },
                        properties: {
                            password: {
                                type: 'password',
                                isVisible: { list: false, filter: false, show: false, edit: true, new: true }
                            }
                        },
                        actions: {
                            list: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
                            show: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
                            delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
                            new: {
                                isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
                                before: async (request) => {
                                    if (request.payload.password) {
                                        request.payload.password = await bcrypt.hash(request.payload.password, 10);
                                    }
                                    return request;
                                },
                            },
                            edit: {
                                isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
                                after: async (response) => {
                                    if (response?.record?.params) {
                                        response.record.params.password = '';
                                    }
                                    return response;
                                },
                                before: async (request) => {
                                    if (request.payload.password && request.payload.password.length > 0) {
                                        request.payload.password = await bcrypt.hash(request.payload.password, 10);
                                    }
                                    else {
                                        delete request.payload.password;
                                    }
                                    return request;
                                },
                            },
                        }
                    }
                },
                {
                    resource: Product,
                    options: {
                        parent: { name: 'Inventory', icon: 'Package' },
                        actions: {
                            new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
                            edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
                            delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
                        }
                    },
                },
                {
                    resource: Category,
                    options: {
                        parent: { name: 'Inventory' },
                        actions: {
                            edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
                            new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
                            delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
                        }
                    }
                },
                {
                    resource: Order,
                    options: {
                        parent: { name: 'Sales' },
                        actions: {
                            list: {
                                before: async (request, context) => {
                                    const { currentAdmin } = context;
                                    if (currentAdmin && currentAdmin.role !== 'admin') {
                                        request.query = { ...request.query, 'where.userId': currentAdmin.id };
                                    }
                                    return request;
                                },
                            },
                            edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
                            new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
                            delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
                        }
                    }
                },
                {
                    resource: OrderItem,
                    options: {
                        parent: { name: 'Sales' },
                        actions: {
                            list: {
                                before: async (request, context) => {
                                    const { currentAdmin } = context;
                                    if (currentAdmin && currentAdmin.role !== 'admin') {
                                        request.query = { ...request.query, 'where.userId': currentAdmin.id };
                                    }
                                    return request;
                                },
                            },
                            edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
                            new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
                            delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
                        }
                    }
                },
                {
                    resource: Setting,
                    options: {
                        parent: { name: 'Settings' },
                        actions: {
                            list: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
                            show: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
                            new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
                            edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
                            delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
                        }
                    }
                }
            ],
            rootPath: '/admin',
            componentLoader,
            // Dashboard Configuration
            dashboard: {
                handler: async (request, response, context) => {
                    const currentAdmin = context?.currentAdmin || request?.currentAdmin || request?.session?.admin || null;
                    console.log('currentAdmin:', currentAdmin);
                    if (currentAdmin && currentAdmin.role === 'admin') {
                        const totalUsers = await User.count();
                        const totalOrders = await Order.count();
                        return {
                            role: 'admin',
                            totalUsers,
                            totalOrders,
                            message: 'Admin System Summary'
                        };
                    }
                    const myTotalOrders = await Order.count({
                        where: { userId: currentAdmin?.id || 0 }
                    });
                    return {
                        role: 'user',
                        userName: currentAdmin?.name || 'User',
                        userEmail: currentAdmin?.email || '',
                        myTotalOrders,
                        message: 'Your Personal Summary'
                    };
                },
                component: Components.Dashboard,
            },
            locale: {
                language: 'en',
                translations: {
                    labels: {
                        users: 'Users',
                        products: 'Products',
                        categories: 'Categories',
                        orders: 'Orders',
                        order_items: 'Order Items',
                        settings: 'Settings',
                        Inventory: 'Inventory',
                        Sales: 'Sales',
                        'User Management': 'User Management',
                        Settings: 'Settings'
                    }
                }
            },
            branding: {
                companyName: 'E-Shop Admin',
                softwareBrothers: false,
            },
        };
        const admin = new AdminJS(adminOptions);
        if (process.env.NODE_ENV !== 'production') {
            admin.watch();
        }
        // 4. AdminJS Authenticated Router
        const adminRouter = AdminJSExpress.default.buildAuthenticatedRouter(admin, {
            authenticate: async (email, password) => {
                try {
                    const result = await authService.login(email, password);
                    if (result && (result.user.role === 'admin' || result.user.role === 'user')) {
                        return result.user;
                    }
                    return null;
                }
                catch (error) {
                    return null;
                }
            },
            cookiePassword: process.env.COOKIE_PASSWORD || 'super-secret-password-123',
        }, null, {
            resave: false,
            saveUninitialized: true,
            secret: process.env.SESSION_SECRET || 'session-secret-key'
        });
        app.use(admin.options.rootPath, adminRouter);
        // 2. Middlewares (Global)
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        const authRouter = new AuthRouter();
        authRouter.register(app, '/api');
        app.listen(PORT, () => {
            console.log(` Server is running on http://localhost:${PORT}`);
            console.log(`AdminJS is available at http://localhost:${PORT}${admin.options.rootPath}`);
        });
    }
    catch (error) {
        console.error(' Connection failed:', error);
    }
};
startServer();
