import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';
import { UserRole } from '../enums/userRole.js';

export class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: UserRole; 
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)), 
      defaultValue: UserRole.USER,
    },
  },
  {
    sequelize,
    tableName: 'users',
  }
);

export default User;