'use strict';
const bcrypt = require('bcrypt');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING
  }, {
    hooks: {
      beforeSave: async (user, options) => {
        const saltRounds = 10;
        const salt = await bcrypt.genSaltSync(saltRounds);
        user.password = await bcrypt.hashSync(user.password, salt);
        user.token = await require('crypto').randomBytes(64).toString('hex');
        user.createdAt = new Date();
        user.updatedAt = new Date();
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};