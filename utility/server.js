const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");

const cors = require("cors");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to userServiceDB");
  })
  .catch((err) => {
    console.log("Error connecting to userServiceDB: ", err);
  });

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server listening on port", port);
});
