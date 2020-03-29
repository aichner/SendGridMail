const dotenv = require("dotenv");
dotenv.config();

const models = require("../models");
const populateDB = require('./populateDB');
const queryDB = require('./queryDB');

(async() => {
    const isForce = process.env.DB_FORCE;

    await models.sequelize.sync({ force: isForce });
  
    await populateDB(models);
    await queryDB(models);
  
})()