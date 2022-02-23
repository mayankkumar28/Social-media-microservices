const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

const setupLogging = (app) => {
  app.use(morgan("combined", { stream: accessLogStream }));
};

exports.setupLogging = setupLogging;
