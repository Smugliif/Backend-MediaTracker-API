const express = require("express");

const {
    getTypes,
    getTypeById,
    createType,
    updateType,
    deleteType,
    getTypeByName,
} = require("../controllers/types");

//Setup router
const router = express.Router();

//Type paths
router.get("/", getTypes);
router.get("/:id", getTypeById);
router.get("/name/:type", getTypeByName);
router.post("/", createType);
router.put("/", updateType);
router.delete("/:id", deleteType);

module.exports = router;
