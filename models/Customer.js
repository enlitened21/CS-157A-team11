module.exports = (sequelize,DataTypes)  =>{
    const Customer = sequelize.define("Customer",{
        customer_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        first_name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        last_name : {
            type : DataTypes.STRING
        },
        username : {
            type : DataTypes.STRING
        },
        password : {
            type : DataTypes.STRING
        }
    },{
        tableName: "customer",
        timestamps: false
    });
    
    return Customer;
}