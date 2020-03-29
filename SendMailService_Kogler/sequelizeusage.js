
// get sequelize and models

const dotenv = require("dotenv");
dotenv.config();

const models = require("./models");
const populateDB = require("./helpers/populateDB");

const isForce = process.env.DB_FORCE.toLowerCase() === "true";

models.sequelize.sync({ force: isForce }).then(async () => {

  await populateDB(models);

  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);
})
.catch(error => console.log(error));

