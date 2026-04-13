import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

export class Setting extends Model {
  public id!: number;
  public key!: string;
  public value!: string;
  public description?: string;
}

Setting.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'settings',
  }
);

export default Setting;