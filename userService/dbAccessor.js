const mongoose = require("mongoose");
const User = require("./models/User");
const CryptoJS = require("crypto-js");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to userServiceDB");
  })
  .catch((err) => {
    console.log("Error connecting to userServiceDB: ", err);
  });

const saveToDB = async (data) => {
  const newUser = new User({
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
  const response = await newUser.save();
  return response;
};

const findUser = async (data) => {
  const user = await User.findOne({ userId: data.userId });
  return user;
};

const findPhone = async (data) => {
  const phone = await User.findOne({ phone: data.phone });
  return phone;
};

const checkUser = async (data) => {
  const exists = await User.find({
    $or: [{ userId: data.userId }, { phone: data.phone }],
  });
  return exists.length > 0;
};

const updateUser = async (data, userId) => {
  if (data.password) {
    data.password = CryptoJS.AES.encrypt(
      data.password,
      process.env.PASS_SEC
    ).toString();
  }
  const updateUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: data,
    },
    { new: true }
  );
  return updateUser;
};

const deleteUser = async (userId) => {
  const deleteUser = await User.findByIdAndDelete(userId);
  return deleteUser;
};

module.exports = {
  saveToDB,
  findUser,
  findPhone,
  checkUser,
  updateUser,
  deleteUser,
};
