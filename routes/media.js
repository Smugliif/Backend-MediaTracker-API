const express = require("express");
const {
    getMedia,
    getMediaById,
    createMedia,
    updateMedia,
    deleteMedia,
    getMediaByTitle,
    getMediaByType,
} = require("../controllers/media");

//Setup router
const router = express.Router();

//Media paths
router.get("/", getMedia);
router.get("/:id", getMediaById);
router.get("/title/:title", getMediaByTitle);
router.get("/type/:type", getMediaByType);
router.post("/", createMedia);
router.put("/", updateMedia);
router.delete("/:id", deleteMedia);

module.exports = router;
