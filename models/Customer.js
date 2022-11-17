module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define("Customer", {
        customer_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING
        },
        username: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        }
    }, {
        tableName: "customer",
        timestamps: false
    });

    Customer.associate = models => {
        // Customer.hasMany(models.Order, {
        //     foreignKey: {
        //         allowNull: false,
        //         name: "member_id"
        //     }
        // }),
        Customer.hasMany(models.Favourite, {
            foreignKey: {
                allowNull: false,
                name: "customer_id"
            }
        });

        return Customer;
    }