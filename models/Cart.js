module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define("Cart", {
        cart_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        }
    }, {
        tableName: "cart",
        timestamps: false
    });

    Cart.associate = models => {
        Cart.belongsTo(models.Customer, {
            foreignKey: {
                allowNull: false,
                name: "customer_id"
            }
        }),
            Cart.belongsToMany(models.Product, {
                through: models.CartProduct,
                foreignKey: 'cart_id',
                timestamps: false
            });
    };

    return Cart;
}