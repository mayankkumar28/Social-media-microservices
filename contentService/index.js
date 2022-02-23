const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const contentRoute = require("./routes/content");
const cors = require("cors");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to contentServiceDB");
  })
  .catch((err) => {
    console.log("Error connecting to contentServiceDB: ", err);
  });

app.use(cors());
app.use(express.json());

app.use("/content", contentRoute);

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log("userInteractionService listening on port", port);
});
