const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resource.controller");
const authenticateToken = require("../middlewares/isAuth");
const upload = require("../../util/multer");

router.post(
  "/new",
  authenticateToken,
  upload("uploads/resourceMedia", [
    "application/pdf",
    "video/mp4",
    "image/png",
    "image/jpeg",
    "text/plain",
  ]).single("file"),
  resourceController.createResource
);
router.get("/getAll", resourceController.getAllResources);
router.get("/getById/:id", resourceController.getResourceById);
router.put(
  "/update/:id",
  authenticateToken,
  upload("uploads/resourceMedia", [
    "application/pdf",
    "video/mp4",
    "image/png",
    "image/jpeg",
    "text/plain",
  ]).single("file"),
  resourceController.updateResource
);
router.delete(
  "/delete/:id",
  authenticateToken,
  resourceController.deleteResource
);



router.get("/get/byCollection/:collectionId",authenticateToken, resourceController.getAllResourcesByCollection);
router.get("/get/byUploader",authenticateToken, resourceController.getAllResourcesByUploader);


module.exports = router;
