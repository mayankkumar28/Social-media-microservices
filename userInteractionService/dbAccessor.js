const mongoose = require("mongoose");
const Interaction = require("./models/Interaction");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to contentServiceDB");
  })
  .catch((err) => {
    console.log("Error connecting to contentServiceDB: ", err);
  });

const findUser = async (data) => {
  const user = await Interaction.findOne({ userId: data.userId });
  return user;
};

const saveLike = async (user, contentId) => {
  await user.likedContents.push(contentId);
  await user.save();
};
const saveRead = async (user, contentId) => {
  await user.readContents.push(contentId);
  await user.save();
};

const saveFirstInteraction = async (data, contentId, type) => {
  if (type === "like") {
    const newInteraction = new Interaction({
      userId: data.userId,
      likedContents: contentId,
    });
    await newInteraction.save();
  } else if (type === "read") {
    const newInteraction = new Interaction({
      userId: data.userId,
      readContents: contentId,
    });
    await newInteraction.save();
  }
};

module.exports = {
  findUser,
  saveLike,
  saveFirstInteraction,
  saveRead,
};
