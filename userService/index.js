const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const userRoute = require("./routes/user");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/user", userRoute);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("userInteractionService listening on port", port);
});
