const mongoose = require("mongoose");
const Content = require("./models/Content");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to contentServiceDB");
  })
  .catch((err) => {
    console.log("Error connecting to contentServiceDB: ", err);
  });

const saveToDB = async (data) => {
  const date = data.date ? new Date(data.date) : new Date();
  const content = new Content({
    title: data.title,
    story: data.story,
    publishedDate: date,
    userId: data.userId,
  });
  const response = await content.save();
  return response;
};

const findContent = async (contentId) => {
  const content = await Content.findOne({ _id: contentId });
  return content;
};

const updateContent = async (contentId, data) => {
  const updatedContent = await Content.findByIdAndUpdate(
    contentId,
    {
      $set: data,
    },
    { new: true }
  );
  return updatedContent;
};

const deleteContent = async (contentId) => {
  const deleteContent = await Content.findByIdAndDelete(contentId);
  return deleteContent;
};

const sortContent = async (sortType) => {
  switch (sortType) {
    case "recent":
      const recentContent = await Content.find().sort({ publishedDate: -1 });
      return recentContent;
    case "mostLiked":
      const mostLikedContent = await Content.find().sort({ likes: -1 });
      return mostLikedContent;
    case "mostRead":
      const mostReadContent = await Content.find().sort({ reads: -1 });
      return mostReadContent;
    default:
      return "Invalid sort type";
  }
};

const filterContent = async (author) => {
  const filterContent = await Content.find({ userId: author });
  return filterContent;
};

const interactContent = async (interaction, contentId) => {
  switch (interaction) {
    case "like":
      await Content.updateOne({ _id: contentId }, { $inc: { likes: 1 } });
      break;
    case "read":
      await Content.updateOne({ _id: contentId }, { $inc: { reads: 1 } });
      break;
    default:
      return "Invalid interaction type";
  }
};

module.exports = {
  saveToDB,
  findContent,
  updateContent,
  deleteContent,
  sortContent,
  filterContent,
  interactContent,
};
