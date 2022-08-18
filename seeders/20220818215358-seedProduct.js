'use strict';
const fs = require('fs')

module.exports = {
  up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     let data=JSON.parse(fs.readFileSync('./data/products.json','utf-8')).map(el=>{
      el.createdAt=el.updatedAt=new Date()
      return el
     })
     
     return queryInterface.bulkInsert('Products',data,{})
  },

  down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     return queryInterface.bulkDelete('Products',null,{})
  }
};
