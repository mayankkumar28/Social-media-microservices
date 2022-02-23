const router = require("express").Router();
const Interaction = require("../models/Interaction");
const { updateLike, updateRead } = require("./contentInteraction.js");
const { verifyTokenAndAuthorization } = require("../../utility/verifyToken");

//LIKE CONTENT
router.post("/like/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const interaction = await Interaction.findOne({ userId: req.body.userId });
    if (interaction) {
      if (interaction.likedContents.includes(req.params.id)) {
        return res.status(400).json("Content already liked!");
      }
      const response = await updateLike(req.params.id);
      if (response.status === 200) {
        await interaction.likedContents.push(req.params.id);
        await interaction.save();
        return res.status(200).json("Content liked!");
      }
      //console.log(response);
      return res.status(response.status).json("Invalid content id!");
    } else {
      const newInteraction = new Interaction({
        userId: req.body.userId,
        likedContents: req.params.id,
      });
      const response = await updateLike(req.params.id);
      if (response.status === 200) {
        await newInteraction.save();
        return res.status(200).json("Content liked!");
      }
      console.log("response");
      return res.status(response.status).json(response.message);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//READ CONTENT
router.post("/read/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const interaction = await Interaction.findOne({ userId: req.body.userId });
    if (interaction) {
      if (interaction.readContents.includes(req.params.id)) {
        return res.status(400).json("Content already read!");
      }
      const response = await updateRead(req.params.id);
      if (response.status === 200) {
        await interaction.readContents.push(req.params.id);
        await interaction.save();
        return res.status(200).json("Content read!");
      }
      return res.status(response.status).json(response.message);
    } else {
      const newInteraction = new Interaction({
        userId: req.body.userId,
        readContents: req.params.id,
      });
      const response = await updateRead(req.params.id);
      if (response.status === 200) {
        await newInteraction.save();
        return res.status(200).json("Content read!");
      }
      return res.status(response.status).json(response.message);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
