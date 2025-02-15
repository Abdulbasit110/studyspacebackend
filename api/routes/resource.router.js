const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resource.controller");
const authenticateToken = require("../middlewares/isAuth");
const upload = require("../middlewares/multer");

router.post(
    "/new",
    authenticateToken,
    upload("uploads/resources", ["application/pdf", "video/mp4", "image/png", "image/jpeg", "text/plain"]),
    resourceController.createResource
);
router.get("/getAll", resourceController.getAllResources);
router.get("/getById/:id", resourceController.getResourceById);
router.put(
    "/update/:id",
    authenticateToken,
    upload("uploads/resources", ["application/pdf", "video/mp4", "image/png", "image/jpeg", "text/plain"]),
    resourceController.updateResource
);
router.delete("/delete/:id", authenticateToken, resourceController.deleteResource);

module.exports = router;