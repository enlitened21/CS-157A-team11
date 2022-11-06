module.exports = (sequelize,DataTypes)  =>{
    const Cart = sequelize.define("Cart",{
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        product_id : {
            type : DataTypes.INTEGER,
            allowNull : false
        }
    },{
        tableName: "cart",
        timestamps: false
    });
    
    return Cart;
}