const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const csv = require("csvtojson");
const {
  saveToDB,
  findUser,
  findPhone,
  checkUser,
  updateUser,
  deleteUser,
} = require("../dbAccessor");

//REGISTER
router.post("/register", async (req, res) => {
  const data = req.body;
  try {
    const exists = await checkUser(data);
    if (exists.length > 0)
      return res.status(400).json("userId or phone already exists!");
    const savedUser = await saveToDB(data);
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  const data = req.body;
  try {
    const user = await findUser(data);
    if (!user) return res.status(401).json("Incorrect userId!");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    if (OriginalPassword !== req.body.password)
      return res.status(401).json("Incorrect password!");
    const accessToken = jwt.sign(
      {
        id: user._id,
        userId: user.userId,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "2d" }
    );
    res.status(200).json({ "Auth token:": accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE USER DETAILS
router.put("/update", async (req, res) => {
  const data = req.body;

  try {
    const user = await findUser(data);
    if (!user) return res.status(401).json("Incorrect userId!");
    if (data.phone) {
      const phone = await findPhone(data);
      if (phone) return res.status(401).json("Phone number is already in use!");
    }
    const updatedUser = await updateUser(data, user._id);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE USER
router.delete("/delete/:userId", async (req, res) => {
  const data = req.params;
  try {
    const user = await findUser(data);
    if (!user) return res.status(401).json("Incorrect userId!");
    await deleteUser(user._id);
    res.status(200).json("User has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//FIND AND GET USER DETAILS
router.get("/find/:userId", async (req, res) => {
  const data = req.params;
  try {
    const user = await findUser(data);
    if (!user) return res.status(401).json("Cannot find userId!");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DATA INGESTION TO DB
router.post("/test/:filename", async (req, res) => {
  const csvFilePath = path.join(__dirname, `/../test/${req.params.filename}`);
  if (!fs.existsSync(csvFilePath)) {
    return res.status(404).send("File not found");
  }
  const jsonArray = await csv().fromFile(csvFilePath);
  try {
    jsonArray.forEach(async (data) => {
      const exists = await checkUser(data);
      if (exists) return console.log("userId or phone already exists in db!");
      else {
        await saveToDB(data);
      }
    });
    res.status(200).json("Data has been ingested to DB");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
