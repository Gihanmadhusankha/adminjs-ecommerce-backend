import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import { OrderType } from "../enums/OrderType.js";
export class Order extends Model {
}
Order.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(...Object.values(OrderType)),
        defaultValue: OrderType.PENDING
    }
}, {
    sequelize,
    tableName: 'orders'
});
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
export default Order;
