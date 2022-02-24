const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const contentRoute = require("./routes/content");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/content", contentRoute);

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log("contentService listening on port", port);
});
