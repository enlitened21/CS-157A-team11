module.exports = (sequelize,DataTypes)  =>{
    const Product = sequelize.define("Product",{
        flight_no: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        airline_name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        arriving_from : {
            type : DataTypes.STRING
        },
        departing_to : {
            type : DataTypes.STRING
        },
        scheduled_time : {
            type : DataTypes.TIME,
            allowNull : false
        },
        status: {
            type: DataTypes.ENUM("ON_TIME", "ARRIVED", "DEPARTING", "DEPARTED", "DELAYED", "CANCELLED"),
            allowNull: false
        },
        gate_no: {
            type: DataTypes.INTEGER
        },
        baggage_no: {
            type: DataTypes.INTEGER
        }
    },{
        tableName: "products",
        timestamps: false
    });

    Flight.associate = models => {
        Flight.belongsTo(models.Gate, {
            foreignKey: "gate_no",
            as: "gate"
        }),
        Flight.belongsTo(models.Baggage, {
            foreignKey: "baggage_no",
            as: "baggage"
        });
    };

    return Product;
}