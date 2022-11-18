module.exports = (sequelize, DataTypes) => {
    const CartProduct = sequelize.define("CartProduct", {
        quantity: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        }
    }, {
        tableName: "cartProduct",
        timestamps: false
    });

    return CartProduct;
};