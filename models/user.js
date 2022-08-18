'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs')
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      isEmail: true,
      validate: {
        notEmpty: {
          msg: 'Email is required'
        },
        notNull: {
          msg: 'Email is required'
        },
        isEmail: {
          msg: 'Not an Email'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password is required'
        },
        notNull: {
          msg:'Password is required'
        },
        len: {
        args: [8,15],
        msg: 'Minimum Password length is 8'
      }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Role is required'
        },
        notNull: {
          msg: 'Role is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.addHook('beforeCreate', (instance,options) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(instance.password, salt);
    
    instance.password = hash
  } )
  return User;
};