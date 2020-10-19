const express = require("express");
const logger = require("morgan");
const path = require("path");
const app = express();
const router = require("./routes/v1");
var cors = require("cors");

// ************* Middlewares************* //

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ************* routes ************* //

app.use("/api/v1", router);

module.exports = app;
