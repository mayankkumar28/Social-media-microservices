const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const interactionRoute = require("./routes/interaction");
const cors = require("cors");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to userInteractionServiceDB");
  })
  .catch((err) => {
    console.log("Error connecting to userInteractionServiceDB: ", err);
  });

app.use(cors());
app.use(express.json());
app.use("/interaction", interactionRoute);

const port = process.env.PORT || 3003;

app.listen(port, () => {
  console.log("userInteractionService listening on port", port);
});
