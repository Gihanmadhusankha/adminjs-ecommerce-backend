import express from 'express';
import AdminJS, { ComponentLoader } from 'adminjs';
import * as AdminJSExpress from '@adminjs/express';
import * as AdminJSSequelize from '@adminjs/sequelize';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as url from 'url';
import path from 'path';

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
    SettingsPage: componentLoader.add('SettingsPage', path.resolve(__dirname, './admin/components/SettingsPage.tsx')),
    SidebarPages: componentLoader.override('SidebarPages', path.resolve(__dirname, './admin/components/SidebarPages.tsx')),
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
                            list: { isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin' },
                            show: { isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin' },
                            delete: { isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin' },
                            new: {
                                isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin',
                            },
                            edit: {
                                isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin',
                                after: async (response: any) => {

                                    if (response?.record?.params) {
                                        response.record.params.password = '';
                                    }
                                    return response;
                                },

                                before: async (request: any) => {
                                    if (!request.payload.password || request.payload.password.length === 0) {
                                        delete request.payload.password;
                                    }
                                    return request;
                                },
                            },
                        }
                    }
                },
                {
                    resource: Category,
                    options: {
                        parent: { name: 'Inventory' },
                        actions: {

                            edit: { isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin' },
                            new: { isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin' },
                            delete: { isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin' },
                        }
                    }
                },
                {
                    resource: Product,
                    options: {
                        parent: { name: 'Inventory', icon: 'Package' },
                        actions: {
                            new: { isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin' },
                            edit: { isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin' },
                            delete: { isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin' },
                        }
                    },
                },

                


                {
                    resource: Order,
                    options: {
                        parent: { name: 'Sales' },


                        properties: {
                            totalAmount: {
                                isDisabled: true,
                                isVisible: { list: true, show: true, edit: true, filter: true }
                            },

                        },

                        listProperties: ['id', 'userId', 'totalAmount', 'status', 'createdAt'],
                        showProperties: ['id', 'userId', 'totalAmount', 'status', 'createdAt'],

                        actions: {
                            list: {
                                before: async (request: any, context: any) => {
                                    const { currentAdmin } = context;
                                    if (currentAdmin && currentAdmin.role !== 'admin') {
                                        request.query = { ...request.query, 'where.userId': currentAdmin.id };
                                    }
                                    return request;
                                },
                            },
                            show: { isAccessible: true },
                            edit: { isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin' },
                            new: { isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin' },
                            delete: { isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin' },
                        }
                    }
                },

                {
                    resource: OrderItem,
                    options: {
                        parent: { name: 'Sales' },

                        listProperties: ['id', 'orderId', 'productId', 'quantity', 'price'],

                        properties: {
                            price: {
                                type: 'number',
                                isDisabled: true,
                                isVisible: { list: true, show: true, edit: true, filter: true },
                                description: 'This price is automatically fetched from the selected product.'
                            },
                        },

                        actions: {
                            new: {
                                isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin',
                                after: async (response: any, request: any, context: any) => {
                                    const { record } = response;


                                    if (request.method === 'post' && record && record.id && !Object.keys(record.errors).length) {

                                        const productId = record.params.productId;
                                        const orderId = record.params.orderId;

                                        if (productId && orderId) {

                                            const product = await Product.findByPk(productId);

                                            if (product) {

                                                await OrderItem.update(
                                                    { price: product.price },
                                                    { where: { id: record.id } }
                                                );


                                                const allItems = await OrderItem.findAll({
                                                    where: { orderId: orderId }
                                                });

                                                const newTotal = allItems.reduce((sum, item) => {
                                                    return sum + (Number(item.price) * Number(item.quantity));
                                                }, 0);


                                                await Order.update(
                                                    { totalAmount: newTotal },
                                                    { where: { id: orderId } }
                                                );
                                            }
                                        }
                                    }
                                    return response;
                                },
                                list: {
                                    before: async (request: any, context: any) => {
                                        const { currentAdmin } = context;
                                        if (currentAdmin && currentAdmin.role !== 'admin') {
                                            request.query = { ...request.query };
                                        }
                                        return request;
                                    },
                                },
                                edit: { isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin' },
                                delete: { isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin' },
                            }
                        }
                    }
                },
                {
                    resource: Setting,
                    options: {

                        parent: { name: 'Settings' },
                        listProperties: ['key', 'value', 'updatedAt'],
                        actions: {
                            list: { isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin' },
                            show: { isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin' },
                            new: { isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin' },
                            edit: { isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin' },
                            delete: { isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin' },
                        }
                    }
                }
            ],
            rootPath: '/admin',
            componentLoader,
            // Dashboard Configuration
            dashboard: {
                handler: async (request: any, response: any, context: any) => {
                    const currentAdmin = context?.currentAdmin || request?.currentAdmin || request?.session?.admin || null;

                    console.log('currentAdmin:', currentAdmin);
                    if (currentAdmin && currentAdmin.role === 'admin') {
                        const totalCustomers = await User.count({
                            where: {
                                role: 'user'
                            }
                        });
                        const totalOrders = await Order.count();
                        const totalRevenue = await Order.sum('totalAmount') || 0;
                        return {
                            role: 'admin',
                            totalUsers: totalCustomers,
                            totalOrders,
                            totalRevenue: parseFloat(totalRevenue.toString()).toFixed(2),
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
            pages: {
                'System Settings': {
                    handler: async (request: any, response: any, context: any) => {
                        if (context?.currentAdmin?.role !== 'admin') {
                            return response.status(403).json({ message: 'Forbidden' });
                        }

                        const settings = await Setting.findAll();
                        const settingsMap: Record<string, any> = {};
                        settings.forEach((s: any) => {
                            settingsMap[s.key] = s.value;
                        });
                        return { settings: settingsMap };
                    },
                    component: Components.SettingsPage,
                },
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
        const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
            authenticate: async (email, password) => {
                try {
                    const result = await authService.login(email, password);
                    if (result && (result.user.role === 'admin' || result.user.role === 'user')) {
                        return result.user;
                    }
                    return null;
                } catch (error) {
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
        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        const authRouter = new AuthRouter();
        authRouter.register(app, '/api');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`AdminJS is available at http://localhost:${PORT}${admin.options.rootPath}`);
        });

    } catch (error) {
        console.error(' Connection failed:', error);
    }
};

startServer();