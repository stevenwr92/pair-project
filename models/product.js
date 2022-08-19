'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category),
      Product.belongsTo(models.User)
    }

  }
  Product.init({
    name: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:{msg:`name field is required`},
        notNull:true
      }
    },
    description: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:{msg:`description field is required`},
        notNull:true
      }
    },
    price: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notEmpty:{msg:`price field is required`},
        notNull:true
      }
    },
    CategoryId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notEmpty:{msg:`Category field is required`},
        notNull:true
      }
    },
    UserId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notEmpty:{msg:`name field is required`},
        notNull:true
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};