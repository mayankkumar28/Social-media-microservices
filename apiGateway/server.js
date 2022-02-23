const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const { ROUTES } = require("./routes/routes");
const { setupLogging } = require("./logs/logging");
const { setupProxies } = require("./routes/proxy");
const { setupAuth } = require("./middlewares/auth");

app.use(cors());
app.use(express.json());
setupLogging(app);
setupAuth(app, ROUTES);
setupProxies(app, ROUTES);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server listening on port", port);
});
