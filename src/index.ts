import express from 'express';
import AdminJS from 'adminjs';
import * as AdminJSExpress from '@adminjs/express'; 
import * as AdminJSSequelize from '@adminjs/sequelize';
import dotenv from 'dotenv';

import sequelize from './config/db.js';


import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import OrderItem from './models/OrderItem.js';
import Setting from './models/Setting.js';


dotenv.config();

AdminJS.registerAdapter(AdminJSSequelize);

const startServer = async () => {
  try {
    const app = express();
    const PORT = process.env.PORT || 3000;

    await sequelize.authenticate();
    console.log(' Database connected!');

    await sequelize.sync({ alter: true }); 
    console.log(' Models synced!');

    // AdminJS Configuration
    const adminOptions = {
      resources: [
        {
          resource: User,
          options: {
            parent: { name: 'User Management', icon: 'User' },
            properties: {
              password: { isVisible: false }, 
            },
          },
        },
        {
          resource: Category,
          options: {
            parent: { name: 'Inventory', icon: 'Package' },
          },
        },
        {
          resource: Product,
          options: {
            parent: { name: 'Inventory', icon: 'Package' },
            properties: {
              price: { type: 'number' },
              stock: { type: 'number' },
            },
          },
        },
        {
          resource: Order,
          options: {
            parent: { name: 'Sales', icon: 'ShoppingCart' },
            properties: {
              totalAmount: { isEditable: false },
            },
          },
        },
        {
          resource: OrderItem,
          options: {
            parent: { name: 'Sales', icon: 'ShoppingCart' },
          },
        },
        {
          resource: Setting,
          options: {
            parent: { name: 'Settings', icon: 'Settings' },
          },
        }
      ],
      rootPath: '/admin',
      branding: {
        companyName: 'E-Shop Admin',
        softwareBrothers: false, 
      },
    };

    const admin = new AdminJS(adminOptions);

  
    const adminRouter = AdminJSExpress.default.buildRouter(admin);
    app.use(admin.options.rootPath, adminRouter);

    app.listen(PORT, () => {
      console.log(` Server is running on http://localhost:${PORT}`);
      console.log(` AdminJS is available at http://localhost:${PORT}${admin.options.rootPath}`);
    });
  } catch (error) {
    console.error(' Connection failed:', error);
  }
};

startServer();