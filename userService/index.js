const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const userRoute = require("./routes/user");
const cors = require("cors");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to userServiceDB");
  })
  .catch((err) => {
    console.log("Error connecting to userService DB: ", err);
  });

app.use(cors());
app.use(express.json());
app.use("/user", userRoute);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("userInteractionService listening on port", port);
});
