module.exports = (sequelize, DataTypes) => {
    const ContactUs = sequelize.define("ContactUs", {
        contact_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: "contactUs",
        timestamps: false
    });

    ContactUs.associate = models => {
        ContactUs.belongsTo(models.Customer, {
            foreignKey: {
                allowNull: false,
                name: "customer_id"
            }
        })
    };

    return ContactUs;
};