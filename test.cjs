const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:She@123@localhost:5432/adminjs_ecommerce');

sequelize.query('SELECT id, email, role FROM "Users"').then(([res]) => {
  console.log(res);
  process.exit(0);
}).catch(e => {
  console.error(e.message);
  process.exit(1);
});