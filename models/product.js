module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("Product", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        tableName: "products",
        timestamps: false
    });

    Product.associate = models => {
        Product.belongsTo(models.Category, {
            foreignKey: {
                allowNull: false,
                name: "category_id"
            }
        }),
        Product.belongsToMany(models.Order, {
            through: models.OrderProduct,
            foreignKey: 'product_id',
            timestamps: false
        }),
        Product.belongsToMany(models.Cart, {
            through: models.CartProduct,
            foreignKey: 'product_id',
            timestamps: false
        });

    return Product;
}