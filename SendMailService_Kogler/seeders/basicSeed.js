var models = require("../models");

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return true;
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
