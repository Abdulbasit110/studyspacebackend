const Resource = require("../models/resource.model");
const { createErrorResponse } = require("../../util/errorHandler");

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

    res.status(200).json({ code: 200, message: "Resource deleted" });
  } catch (error) {
    createErrorResponse(res, error);
  }
};

module.exports = {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
};
