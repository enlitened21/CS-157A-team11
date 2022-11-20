module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("Category", {
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        category_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        tableName: "category",
        timestamps: false
    });

    return Category;
};