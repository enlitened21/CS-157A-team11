module.exports = (sequelize,DataTypes)  =>{
    const Product = sequelize.define("Product",{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        category : {
            type : DataTypes.STRING
        },
        image : {
            type : DataTypes.STRING,
            allowNull: true,
        }
    },{
        tableName: "products",
        timestamps: false
    });
    
    return Product;
}