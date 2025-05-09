// app.js
const express = require("express");
const bodyParser = require("body-parser");
const evaluateRoute = require("./routes/evaluate");

const app = express();
app.use(bodyParser.json());

app.use("/api/evaluate", evaluateRoute);

module.exports = app;
