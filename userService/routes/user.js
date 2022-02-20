const User = require("../models/User");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const router = require("express").Router();

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
  });

  try {
    const exists = await User.find({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    });
    if (exists.length > 0)
      return res.status(400).json("Email or phone already exists!");
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json("Incorrect email!");

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
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "99d" }
    );
    res.status(200).json({ user, accessToken });
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
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json("Incorrect email!");
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
router.delete("/delete", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json("Incorrect email!");
    await User.findByIdAndDelete(user._id);
    res.status(200).json("User has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//FIND AND GET USER DETAILS
router.put("/find", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json("Cannot find email!");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
