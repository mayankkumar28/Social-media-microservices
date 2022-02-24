const router = require("express").Router();
const { updateLike, updateRead } = require("./contentInteraction.js");
const {
  findUser,
  saveLike,
  saveFirstInteraction,
  saveRead,
} = require("../dbAccessor.js");

//LIKE CONTENT
router.post("/like/:id", async (req, res) => {
  const data = req.body;
  try {
    const user = await findUser(data);
    if (user) {
      if (user.likedContents.includes(req.params.id)) {
        return res.status(409).json("Content already liked!");
      }
      const response = await updateLike(req.params.id);
      if (response.status === 200) {
        await saveLike(user, req.params.id);
        return res.status(200).json("Content liked successfully!");
      }
      return res.status(400).json("Invalid content id!");
    } else {
      const response = await updateLike(req.params.id);
      if (response.status === 200) {
        await saveFirstInteraction(data, req.params.id, "like");
        return res.status(200).json("Content liked successfully!");
      }
      return res.status(400).json("Invalid content id!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//READ CONTENT
router.post("/read/:id", async (req, res) => {
  const data = req.body;
  try {
    const user = await findUser(data);
    if (user) {
      if (user.readContents.includes(req.params.id)) {
        return res.status(409).json("Content already read!");
      }
      const response = await updateRead(req.params.id);
      if (response.status === 200) {
        await saveRead(user, req.params.id);
        return res.status(200).json("Content read successfully!");
      }
      return res.status(400).json("Invalid content id!");
    } else {
      const response = await updateRead(req.params.id);
      if (response.status === 200) {
        await saveFirstInteraction(data, req.params.id, "read");
        return res.status(200).json("Content read successfully!");
      }
      return res.status(400).json("Invalid content id!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
