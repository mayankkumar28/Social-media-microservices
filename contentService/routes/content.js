const router = require("express").Router();
const Content = require("../models/Content");
const csv = require("csvtojson");
const fs = require("fs");
const path = require("path");
const { verifyTokenAndAuthorization } = require("../../utility/verifyToken");
const expressjwt = require("express-jwt");
const jwtCheck = expressjwt({ secret: "test", algorithms: ["HS256"] });

//DATA INGESTION TO DB
router.post("/test/:filename", async (req, res) => {
  const csvFilePath = path.join(__dirname, `/test/${req.params.filename}`);
  if (!fs.existsSync(csvFilePath)) {
    return res.status(404).send("File not found");
  }
  const jsonArray = await csv().fromFile(csvFilePath);
  try {
    jsonArray.forEach(async (data) => {
      const content = new Content({
        title: data.title,
        story: data.story,
        publishedDate: new Date(data.publishedDate),
        userId: data.userId,
      });
      await content.save();
    });
    res.status(201).json("data uploaded to contentServiceDB");
  } catch (error) {
    res.status(500).json(error);
  }
});

//POST CONTENT
router.post("/post", verifyTokenAndAuthorization, async (req, res) => {
  const content = new Content({
    title: req.body.title,
    story: req.body.story,
    userId: req.body.userId,
    publishedDate: new Date(),
  });
  try {
    const data = await content.save();
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE CONTENT
router.put("/update/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const content = await User.findOne({ _id: req.params.id });
    if (!content) return res.status(404).json("Incorrect content id!");
    if (content.userId !== req.body.userId)
      return res.status(401).json("Permission denied!");
    const updatedContent = await Content.findByIdAndUpdate(
      content._id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedContent);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE CONTENT
router.delete("/delete/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const content = await Content.findOne({ _id: req.params.id });
    if (!content) return res.status(404).json("Incorrect content id!");
    if (content.userId !== req.body.userId) {
      return res.status(401).json("Permission denied!");
    }
    await content.findByIdAndDelete(content._id);
    res.status(200).json("Content has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//SORT BY NEW CONTENT
router.get("/recent", async (req, res) => {
  try {
    const newContent = await Content.find().sort({ publishedDate: -1 });
    res.status(200).json(newContent);
  } catch (error) {
    res.status(500).json(error);
  }
});

//TOP CONTENT BY LIKES
router.get("/mostLiked", async (req, res) => {
  try {
    const newContent = await Content.find().sort({ likes: -1 });
    res.status(200).json(newContent);
  } catch (error) {
    res.status(500).json(error);
  }
});

//TOP CONTENT BY READES
router.get("/mostRead", async (req, res) => {
  try {
    const newContent = await Content.find().sort({ reads: -1 });
    res.status(200).json(newContent);
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE LIKES
router.put("/updateLikes", async (req, res) => {
  const contentId = req.headers.id;
  try {
    const update = await Content.findOne({ _id: contentId });
    if (!update) return res.status(404).json("Incorrect content id!");
    await Content.updateOne({ _id: contentId }, { $inc: { likes: 1 } });
    res.status(200).json("Liked");
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE READS
router.put("/updateReads", async (req, res) => {
  const contentId = req.headers.id;
  console.log(contentId);
  try {
    const update = await Content.findOne({ _id: contentId });

    if (!update) return res.status(404).json("Incorrect content id!");
    await Content.updateOne({ _id: contentId }, { $inc: { reads: 1 } });
    res.status(200).json("Read");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
