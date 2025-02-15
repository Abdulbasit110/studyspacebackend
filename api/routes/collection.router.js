const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/collection.controller")
const authenticateToken = require("../middlewares/isAuth");
const { validateCreateCollection, validateUpdateCollection } = require("../middlewares/collectionValidation");

router.post("/new", authenticateToken, validateCreateCollection, collectionController.createCollection);
router.get("/getAll", collectionController.getAllCollections);
router.get("/getById/:id", collectionController.getCollectionById);
router.put("/update/:id", authenticateToken,validateUpdateCollection, collectionController.updateCollection);
router.delete("/delete/:id", authenticateToken, collectionController.deleteCollection);

router.get("/get/byCreator", authenticateToken, collectionController.getAllCollectionsByOwner);

module.exports = router;
