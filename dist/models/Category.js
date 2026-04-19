import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';
export class Category extends Model {
}
Category.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'categories'
});
export default Category;
