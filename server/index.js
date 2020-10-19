const express = require("express");
const app = require("./src/app");
const path = require("path");
const { sequelize } = require("./src/models");
const config = require("config");
// const sendNotification = require("./src/midellwares/notif");
const PORT = process.env.PORT || 2020;
require("dotenv").config();

if (!process.env.JWT_KEY) {
  console.log("Priavte key not intialsed");
  process.exit(1);
}
// //check if the app in production  to serve static content//

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("./client/build"));
// }
// sequelize.drop();

sequelize.sync({ alter: true }).then(
  app.listen(PORT, () => {
    console.log(`app listening at port ${PORT}...`);
  })
);

// setInterval(sendNotification, 10000 * 60 * 60 * 24);
