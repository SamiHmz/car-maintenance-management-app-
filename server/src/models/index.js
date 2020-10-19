var fs = require("fs");
var path = require("path");
require("dotenv").config();
var Sequelize = require("sequelize");
const db = {};

// ************* db config ************* //
/*********  dev config ********/
const devConfig = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWOR,
  {
    host: process.env.PG_HOST,
    dialect: "postgres",
    logging: false,
  }
);

/**************production config  ****************/
const prodConfig = new Sequelize(process.env.DATABASE_URL);

const sequelize =
  process.env.NODE_ENV === "production" ? prodConfig : devConfig;

const auth = async (sequelize) => {
  try {
    console.log();
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
auth(sequelize);

// ************* export the models ************* //

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== "index.js" && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
