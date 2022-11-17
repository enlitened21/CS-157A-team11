module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define("Cart", {
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
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