/* test/support/server.js -- start application for testing
 * Copyright 2019 AO GUOV
 *
 * Contributors:
 * Ianovich Sergei <yanovich.sv@guov.ru>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * Stimul
 */

process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const app = require("../app");
const users = require("../test/populate/users");
const sites = require("../test/populate/sites");
const regions = require("../test/populate/regions");

mongoose.set("useCreateIndex", true);
mongoose.connect(app.get("dbURL"), { useNewUrlParser: true });

mongoose.connection.on("connected", async () => {
  await new Promise(resolve => {
    users(resolve);
  });
  await new Promise(resolve => {
    sites(resolve);
  });
  await new Promise(resolve => {
    regions(resolve);
  });
  mongoose.connection.close();
});
