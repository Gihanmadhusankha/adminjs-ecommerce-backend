import { sequelize } from './src/config/db.js';

async function main() {
  const [res] = await sequelize.query('SELECT table_name FROM information_schema.tables WHERE table_schema=\'public\'');
  console.log('Tables:', res);
  
  if (res.find((t: any) => t.table_name === 'users')) {
    const [users] = await sequelize.query('SELECT id, email, role FROM users');
    console.log('Users:', users);
  } else if (res.find((t: any) => t.table_name === 'Users')) {
    const [users] = await sequelize.query('SELECT id, email, role FROM "Users"');
    console.log('Users:', users);
  }
  process.exit(0);
}
main();