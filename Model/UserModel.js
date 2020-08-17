module.exports = (app) => {
    const { sequelize, Sequelize } = app;
    const User = sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        username: {
            type: Sequelize.STRING,
            field: 'username'
        },
        email: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true
    });
    User.sync({ force: false });
    return User;
}