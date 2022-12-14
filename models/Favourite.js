module.exports = (sequelize, DataTypes) => {
    const Favourite = sequelize.define("Favourite", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        }
    }, {
        tableName: "favourite",
        timestamps: false
    });

    Favourite.associate = models => {
        Favourite.belongsTo(models.Customer, {
            foreignKey: {
                allowNull: false,
                name: "customer_id"
            }
        }),
            Favourite.belongsTo(models.Product, {
                foreignKey: {
                    allowNull: false,
                    name: "product_id"
                }
            });
    };

    return Favourite;
};