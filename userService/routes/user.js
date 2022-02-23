const User = require("../models/User");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../../utility/verifyToken");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const csv = require("csvtojson");

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userId: req.body.userId,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
  });

  try {
    const exists = await User.find({
      $or: [{ userId: req.body.userId }, { phone: req.body.phone }],
    });
    if (exists.length > 0)
      return res.status(400).json("userId or phone already exists!");
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.body.userId });
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
      { expiresIn: "99d" }
    );
    res.status(200).json(accessToken);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE USER DETAILS
router.put("/update", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const user = await User.findOne({ userId: req.body.userId });
    if (!user) return res.status(401).json("Incorrect userId!");
    if (req.body.phone) {
      const phone = await User.findOne({ phone: req.body.phone });
      if (phone) return res.status(401).json("Phone number is already in use!");
    }
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE USER
router.delete(
  "/delete/:userId",
  verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      const user = await User.findOne({ userId: req.params.userId });
      if (!user) return res.status(401).json("Incorrect userId!");
      await User.findByIdAndDelete(user._id);
      res.status(200).json("User has been deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//FIND AND GET USER DETAILS
router.put("/find/:userId", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
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
      const user = new User({
        firstName: data.firstName,
        lastName: data.lastName,
        userId: data.userId,
        password: CryptoJS.AES.encrypt(
          data.password,
          process.env.PASS_SEC
        ).toString(),
        phone: data.phone,
        isAdmin: data.isAdmin,
      });
      await user.save();
    });
    res.status(201).json("data uploaded to userServiceDB");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
