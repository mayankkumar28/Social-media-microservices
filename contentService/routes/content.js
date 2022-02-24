const router = require("express").Router();
const csv = require("csvtojson");
const fs = require("fs");
const path = require("path");
const {
  saveToDB,
  findContent,
  updateContent,
  deleteContent,
  sortContent,
  filterContent,
  interactContent,
} = require("../dbAccessor");

//DATA INGESTION TO DB
router.post("/test/:filename", async (req, res) => {
  const csvFilePath = path.join(__dirname, `/../test/${req.params.filename}`);
  if (!fs.existsSync(csvFilePath)) {
    return res.status(404).send("File not found");
  }
  const jsonArray = await csv().fromFile(csvFilePath);
  try {
    jsonArray.forEach(async (data) => {
      await saveToDB(data);
    });
    res.status(201).json("data uploaded to contentServiceDB");
  } catch (error) {
    res.status(500).json(error);
  }
});

//POST CONTENT
router.post("/post", async (req, res) => {
  const data = req.body;
  try {
    const content = await saveToDB(data);
    res.status(201).json(content);
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE CONTENT
router.put("/update/:id", async (req, res) => {
  const contentId = req.params.id;
  const data = req.body;
  try {
    const content = await findContent(contentId);
    if (!content) return res.status(404).json("Incorrect content id!");
    if (content.userId !== req.body.userId)
      return res.status(401).json("Permission denied!");
    const updatedContent = await updateContent(content._id, data);
    res.status(200).json(updatedContent);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE CONTENT
router.delete("/delete/:id", async (req, res) => {
  const contentId = req.params.id;
  try {
    const content = await findContent(contentId);
    if (!content) return res.status(404).json("Incorrect content id!");
    if (content.userId !== req.body.userId) {
      return res.status(401).json("Permission denied!");
    }
    await deleteContent(content._id);
    res.status(200).json("Content has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//SORT BY NEW CONTENT
router.get("/recent", async (req, res) => {
  try {
    const newContent = await sortContent("recent");
    res.status(200).json(newContent);
  } catch (error) {
    res.status(500).json(error);
  }
});

//TOP CONTENT BY LIKES
router.get("/mostLiked", async (req, res) => {
  try {
    const mostLikedContent = await sortContent("mostLiked");
    res.status(200).json(mostLikedContent);
  } catch (error) {
    res.status(500).json(error);
  }
});

//TOP CONTENT BY READES
router.get("/mostRead", async (req, res) => {
  try {
    const mostReadContent = await sortContent("mostRead");
    res.status(200).json(mostReadContent);
  } catch (error) {
    res.status(500).json(error);
  }
});

//SORT BY AUTHOR
router.get("/findByAuthor/:userId", async (req, res) => {
  try {
    const newContent = await filterContent(req.params.userId);
    res.status(200).json(newContent);
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE LIKES
router.put("/updateLikes", async (req, res) => {
  const contentId = req.headers.id;
  try {
    const update = await findContent(contentId);
    if (!update) return res.status(404).json("Incorrect content id!");
    await interactContent("like", contentId);
    res.status(200).json("Liked");
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE READS
router.put("/updateReads", async (req, res) => {
  const contentId = req.headers.id;
  try {
    const update = await findContent(contentId);
    if (!update) return res.status(400).json("Incorrect content id!");
    await interactContent("read", contentId);
    res.status(200).json("Read");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
