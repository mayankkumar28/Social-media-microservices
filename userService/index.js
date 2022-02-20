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

app.listen(process.env.PORT || 3000, () => {
  console.log("userService listening on port 3000");
});
