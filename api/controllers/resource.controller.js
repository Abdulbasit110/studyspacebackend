const Resource = require("../models/resource.model");
const { createErrorResponse } = require("../../util/errorHandler");
const { getResourceUploadUrl } = require("../../util/getUploadUrl");

const createResource = async (req, res, next) => {
  try {
    const { title, description, type, level, createdBy, info, collectionId } = req.body;
    const contentUrl = req.file ? req.file.path : null;
    const uploadedBy = req.userId;

    const newResource = await Resource.create({
      title,
      description,
      type,
      level,
      createdBy,
      info,
      contentUrl,
      uploadedBy,
      collectionId
    });

    if (newResource.contentUrl) {
      newResource.contentUrl = getResourceUploadUrl(newResource.contentUrl);
    }

    res.status(201).json({
      code: 201,
      message: "Resource created successfully",
      data: newResource,
    });
  } catch (error) {
    createErrorResponse(res, error);
  }
};

const getAllResources = async (req, res, next) => {
  try {
    const resources = await Resource.find().populate("uploadedBy", "name email");
    if (resources.length === 0) {
      return res.status(404).json({
        code: 404,
        message: "No resources found",
      });
    }

    resources.forEach((resource) => {
      if (resource.contentUrl) {
        console.log("newResource.contentUrl", resource.contentUrl)
        resource.contentUrl = getResourceUploadUrl(resource.contentUrl)
      }
    });

    res.status(200).json({
      code: 200,
      message: "Resources retrieved",
      data: resources,
    });
  } catch (error) {
    createErrorResponse(res, error);
  }
};

const getResourceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findById(id).populate("uploadedBy", "name email");

    if (!resource) {
      return res.status(404).json({
        code: 404,
        message: "No resource found",
      });
    }

    if (resource.contentUrl) {
      resource.contentUrl = getResourceUploadUrl(resource.contentUrl);
    }

    res.status(200).json({ code: 200, message: "Resource retrieved", data: resource });
  } catch (error) {
    createErrorResponse(res, error);
  }
};

const updateResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (req.file) {
      updates.contentUrl = req.file.path;
    }
    const updatedResource = await Resource.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedResource) throw new NotFoundError("Resource not found");

    if (updatedResource.contentUrl) {
      updatedResource.contentUrl = getResourceUploadUrl(updatedResource.contentUrl);
    }

    res.status(200).json({ code: 200, message: "Resource updated", data: updatedResource });
  } catch (error) {
    createErrorResponse(res, error);
  }
};

const deleteResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedResource = await Resource.findByIdAndDelete(id);
    if (!deletedResource) throw new NotFoundError("Resource not found");

    // Delete file from server
    if (deletedResource.contentUrl) {
      fs.unlink(path.join(__dirname, "../../", deletedResource.contentUrl), (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    res.status(200).json({ code: 200, message: "Resource deleted" });
  } catch (error) {
    createErrorResponse(res, error);
  }
};


const getAllResourcesByCollection = async (req, res, next) => {
  try {
    const { collectionId } = req.params;
    const resources = await Resource.find({ collectionId }).populate("uploadedBy", "name email");
    if (resources.length === 0) {
      return res.status(404).json({
        code: 404,
        message: "No resources found",
      });
    }

    resources.forEach((resource) => {
      if (resource.contentUrl) {
        resource.contentUrl = getResourceUploadUrl(resource.contentUrl)
      }
    });

    res.status(200).json({
      code: 200,
      message: "Resources retrieved",
      data: resources,
    });
  } catch (error) {
    createErrorResponse(res, error);
  }
};


const getAllResourcesByUploader = async (req, res, next) => {
  try {
    const { userId } = req;
    const { search, type, level, category, collectionId } = req.query;

    let filter = { uploadedBy: userId };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (type) {
      filter.type = type;
    }

    if (level) {
      filter.level = level;
    }

    if (category) {
      filter["info.category"] = category;
    }

    if (collectionId) {
      filter.collectionId = collectionId;
    }

    const resources = await Resource.find(filter).populate("uploadedBy", "name email");

    if (resources.length === 0) {
      return res.status(404).json({
        code: 404,
        message: "No resources found",
      });
    }

    // Update content URLs
    resources.forEach((resource) => {
      if (resource.contentUrl) {
        resource.contentUrl = getResourceUploadUrl(resource.contentUrl);
      }
    });

    res.status(200).json({
      code: 200,
      message: "Resources retrieved",
      data: resources,
    });
  } catch (error) {
    createErrorResponse(res, error);
  }
};


// const getAllResourcesByUploader = async (req, res, next) => {
//   try {
//     const { userId } = req;
//     const resources = await Resource.find({ uploadedBy: userId }).populate("uploadedBy", "name email");
//     if (resources.length === 0) {
//       return res.status(404).json({
//         code: 404,
//         message: "No resources found",
//       });
//     }

//     resources.forEach((resource) => {
//       if (resource.contentUrl) {
//         resource.contentUrl = getResourceUploadUrl(resource.contentUrl)
//       }
//     });

//     res.status(200).json({
//       code: 200,
//       message: "Resources retrieved",
//       data: resources,
//     });
//   } catch (error) {
//     createErrorResponse(res, error);
//   }
// };


module.exports = {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
  getAllResourcesByCollection,
  getAllResourcesByUploader

};
