import { DataTypes,Model } from "sequelize";
import sequelize from "../config/db.js";
import Order from "./Order.js";
import { Product } from "./Product.js";


export class OrderItem extends Model {
    public id!: number;
    public quantity!: number;
    public price!: number;
}
OrderItem.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    price:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:true
    }
}, {
    sequelize,
    tableName: 'order_items'
});
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });

OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });

export default OrderItem;